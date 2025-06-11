---
layout: default
---

# QLoRA Fine-tuned LLMs for Recommendation Models at Burberry.

As you browse an e-commerce site, which products are shown is decided by a trained model. A clear location we see a model in action is at checkout - we've added something to our bag, and a pop-up appears recommending us other items. 

Real data is required to train these models. I worked with the data science team at Burberry, with access to all of their transaction, customer, and product data. 

## Recommendation Models

Here, a recommendation model predicts what product a specific customer is most likely to purchase next. We use just their personal information - country, gender, age, previously purchased products <a href="#note4" id="note4ref"><sup>1</sup></a>. Then, it combines as much of this data as possible to build up a profile of the user, then makes its prediction.

As an example using only purchasing paths - if we knew several people purchased products A, then B, then C, if we see a new customer who's purchased A and B, we should recommend them product C. 

Recommendation models boost user engagement and likelihood of purchase, increasing sales for the retailer. There's an argument too for increased retention (i.e., furthering the lifetime value of that customer), since users feel more understood and catered to, having been given a personalised recommendation.

The data source for training these models is derived directly from historical transactions. We take our table of all previous transactions, and for each transaction we can build a supervised training example, where all the available customer information at that point forms the features, and the product purchased the outcome.

<span style="font-size: 0.8em;"><a id="note4" href="#note4ref"><sup>1</sup></a>: Better models use site activity from the current session - have they searched for anything? Have they already clicked on and off another product? </span>

## LLMs, and why LLMs here?

Since the Attention Is All You Need paper, LLMs have become a household name (or at least ChatGPT has). In practice, the output of an LLM is to continuously predict the next token. Obviously this can be adapted into a chat interface, but at root they're still predicting the next token of a piece of prose. You may already see the parallel between predicting the next token, and predicting the next product - by prompting an LLM with the relevant information, it should be able to make a prediction. 

Previous architectures have their problems. If someone's purchased a belt, a clustering model would recommend them another belt since that's what they like. Or, by defining sets of complementary products, another model could understand that if they've already purchased a belt, perhaps they'd like a pair of trousers to go with it. There's ways of combining these two approaches, using architectures like a feature injected BERT4Rec, which is also built off of the transformer architecture (like modern LLMs). 

However, all of these approaches can be summed up by - I found a certain trend in the data, and I built a model to handle it. The motivation behind our use of LLMs is that they should not only be able to find all the trends in the data themselves, but be able to leverage it's own understanding of the world in its prediction. It takes the onus off of the data engineer to find the trends, and allows the model to find them itself.

We can test this hypothesis - for all the trends we ourselves find in the data, we look in the predictions made by the LLM for those same trends. If they're present, we assume that it's found other ones that we haven't even found ourselves. 

### Fine-tuning

Unfortunately, there's a few problems with base LLMs. If I fed the information into any base model, it'd give us a response like 'Based on this information, I think that a hat would be the best recommendation' - brilliant, thanks, but what hat specifically? We need a structured response, one that just gives a SKU, a UUID corresponding to each product. And we need the model to know the universe of predictable products - what if we didn't sell any hats? Then our hat recommendation is entirely useless.

This is where fine-tuning comes in. We take a pretrained base model (here, I use Llama 3.1 8B Instruct), and retrain it over a fine-tuning dataset. Then the model learns which products are valid to predict, eg an SKU of 10872012. Furthermore, with all the prompts in the fine-tuning dataset being the same format, it learns to give just the SKU of a product with no filler fluff around it. And most importantly, it learns the trends present in the dataset. 

Initially I use Low-Rank Adaptatation (LoRA) for fine-tuning. Rather than retraining all 8B parameters of our model, LoRA inserts new, much smaller layers, into the transformer architecture. Without going too technical here, it relies on the fact that the updates to the weight matrices $$\Delta W$$ can be approximated by a lower rank pair of matrices $$A, B$$, such that $$\Delta W = AB$$. <a href="#note1" id="note1ref"><sup>2</sup></a>

Later on, we are motivated to increase the token vocabulary. This increases the size of the embedding matrix enough that it no longer fits in the CUDA memory of our fine-tuning compute cluster. Here I use QLoRA, which selectively quantises model parameters from FP16 (or sometimes FP32) to NF4 <a href="#note2" id="note2ref"><sup>3</sup></a>. This lets the model take up far less memory on the GPU, and enables faster fine-tuning. It's interesting that losing so much information (by way of bits) has empirically little effect on the actual performance of the model. 

<span style="font-size: 0.8em;"><a id="note1" href="#note1ref"><sup>2</sup></a>: I go into far more depth on LoRA and the transformer architecture in the offical report, than I do in this blog. The investigation itself is on NDA-protected data, and thus unshareable, but for a far more mathematical approach to the technologies used, a shortened report is available [here](/resources/Shortened_Report__No_NDA_protected_results_or_data_.pdf).</span>

<span style="font-size: 0.8em;"><a id="note2" href="#note2ref"><sup>3</sup></a>: NF4 is a 4 bit floating point format that follows a log-like distribution, preserving more precision for smaller values that are more important for deep learning models. FP16, FP32 are just standard conventional floating point format in 16, 32 bits. </span>

### Feature-Engineering

Building the fine-tuning dataset requires traditional data science techniques. We are motivated to expose the model only to features which we have established to have predictive power - i.e., by knowing xyz about the customer, we can make a better prediction. Putting in simply everything we know about each transaction would fill up the context window very quickly. 

This took a lot of time, and if I were to do this again I would've spent significantly less time on it. Everything I found I could've guessed. To give a fake example, knowing that country holds twice as much information on the target than age does is interesting, but doesn't change that I will include both of them in the model (assuming that both contain some level of information). 

Furthermore, the task is classification into a high level space of ~5000 products. Naturally, this is a problem that lends itself to machine learning methods, rather than classic methods like Cramer's V or PCA - even just to discover which features contain information.

## Problems

Several problems arise quickly. LLMs aren't designed specifically for product recommendation, so it makes sense that we have to do some wrestling before they yield great results.

#### Invalid SKU Prediction

With an 8 digit SKU, the model tokenises it into 2-4 tokens (depending on the specific digits in the SKU). This is unhelpful - we want the model to predict a product in one shot, not over several separate tokens.

By creating this amalgamation of tokens as the final prediction, some predictions are inevitably invalid, not referring to real products. For example, if our model tries to predict a product with SKU "62893509", it might tokenize this into something like ["6289", "350", "9"] and then make prediction errors on any of these sub-tokens. We might end up with "62893519" - a product that doesn't exist in our catalog. 

There's a few ways to get around this - remapping SKUs from an 8 digit space to a smaller alphanumeric space for example, but the neatest way I found was to increase the vocabulary of the model. Llama 3.1 models have a vocabulary of 128k unique tokens, and it is trivial to add on a token for each product. So instead of representing "62893509" as multiple tokens, we add a single new token like "\<PROD_62893509\>" to the vocabulary. Doing this expansion increases the size of the models embedding matrix, which increases the amount of GPU memory it needs (we can use RAM as well, but it results in significant training slow downs), so here we use QLoRA to reduce model size.

#### Overlearning power laws

All retailers see power laws in their transactions, because some products are naturally sold more than others. This can be shown by a log-log plot of rank of product by popularity vs purchase count. The fine-tuned models had a tendency to overlearn this trend in the data - highly ranking products are predicted far more than their popularity in the data suggests, and lower ranking products are barely ever predicted by the model. 

Rather than fight against this by selecting training examples to lessen the skew of purchase counts, we can try to leverage this emergent behaviour. Product SKUs are remapped such that their new SKU is the rank of the product (e.g. if the most sold product has SKU "62893509", we remap it to "1"). This can implicity teach the model the relevant importance levels, and combined with the token vocabulary expansion shows some improvement over the model trained on unremapped data. 

## Should it work vs. does it work

It should work, and it does work. It's hard to compare results against SoTA models, since our model doesn't have as many data sources available to it as production models. Furthermore, I only had a few research iterations - I'd want to do longer training runs, expose the model to the data in different ways, and experiment with smaller models. Do we really need 8B parameters to capture the complexity of fashion, or could we do it with just 3B? 1B? The smaller the model we use, the more training examples we can show it for the same cost. Furthermore, I barely touched the prompt-engineering side of things, or measured the empirical predictive power of each data source the model was exposed to (e.g., how much better/worse are results when age is removed?) Lastly, it would be cool to look at CoT models - does giving a few thought tokens help?

What we can say about the results is that they're better than randomly guessing, and they're better than always predicting the most popular product <a href="#note3" id="note3ref"><sup>4</sup></a>. To beat this pair of benchmarks so quickly gives hope to the possiblity of massive improvements to come.  

It's also worth saying that new open source base models are constantly being released, each one improving on the last. Our results will only get better when we fine-tune on top of these new models.

<span style="font-size: 0.8em;"><a id="note3" href="#note3ref"><sup>4</sup></a>: To quantify with rough percentages, the best model scores 2-3% for Precision@1, beating 0-0.5% when always predicting the most popular product. Recall the size of the classification space - this is a significant improvement.</span>

## Closing thoughts

This has definitely been the most cutting edge stuff I've worked on while at uni, and the team at Burberry were great to work with. Fine-tuning in general is an exciting area of research, and there's tons of avenues one could take it in. 

E-commerce is going to look very different in the future. As models get better, and inference becomes cheaper, a site personalised entirely to you is inevitable. 

***

Mar 12th, 2025.