---
layout: default
---

# Real-time podcast fact-checking costs pennies.

In mid-April, I was listening to a football podcast and completely lost focus when they spent ten seconds trying to search the Ballon D'Or rankings from 2019. I kept listening for these moments, and it kept happening. Then, I emailed the production studio behind that podcast and told them how I could solve it with an elegant, real-time solution.

&nbsp;

<div style="text-align: center;">
    <img src="pics/tfs-conference-room.jpg" alt="TFS Conference Room" width="75%">
</div>

&nbsp;

### Retention

People losing focus & lowered retention are obviously a *bad thing*, but it's worth ticking off the reasons why. Primarily, you want people to be advocates of your content and brand - they'll tell their friends, and their friends will tell their friends, and so on. But it also impacts the bottom line - higher retention means more viewers will see ads, and if you're selling slots directly to advertisers, later ad slots will be much more valuable with a higher retention stat. 

## Product

[See here for a tech demo on YouTube](https://youtu.be/xz2GeVW3r7k). 

The product itself is trivial. A real-time, fact-checking podcast assistant - it takes audio from all mics, determines if there's ambiguity or someone asking a question, and if so shows an answer to the producer. It's simple enough that I could build the demo in two days.

## Engineering

There are three components - transcription of audio input, question detection, and searching for answers. Each uses a separate model. I'd love to cut out the transcription component and go straight from audio to question detection - it's possible, but doesn't capture more semantic questions, and performs badly with multiple audio inputs.

#### Transcription

Using a whisper base model, an OpenAI model released in 2022, we transcribe the audio input. This is done on device, using whisper.cpp, a great GitHub repo. Running on a M1 Max chip, it transcribes 10s of audio in about ~50ms - not bad! We use a sliding window to make sure that there's enough context for it to transcribe trickier words, such as player names. There's better speech-to-text transcription models we could use with cloud inference, but it needs to be as close to real-time as possible - even the real-time endpoints for APIs will be streamed back, with transcriptions coming in every 10s or so, which isn't fast enough. 

#### Question Detection

Next, we need to determine when there's a question in the transcription. This needs fast inference, so I used groq.com, with a small Llama-3.1-8b-Instant model. With a inference time of 50ms and a total round trip of ~300ms, it's about as fast as off-device inference can get. It also costs basically nothing, $0.05/1M input tok, and $0.08/1M output tok. This runs to about 15 cents for an hour of recording.

The prompt (paraphrased) is: 

"Below is a partial transcription of a podcast. If there's no question or ambiguity, output 'False'. Otherwise, output the formalised question. {then the transcription goes here}". 

We only need the two most recent windows (20s) of the transcription - conversation develops fast. We run this twice a second, getting the answer almost faster than the question is asked (which you see in that YouTube demo!)

The prompt also uses few-shot examples, which is a topic I could probably write a blog post about on its own, so I won't go into it more than - use less than 5 examples, and skew the labelling of the examples towards the most common output you expect (i.e., here I used just one example where the output was indeed a question to ask, and the rest were 'False'). 

#### Searching

Lastly, we need the searching itself. For this I used 4o-search, straight off the OpenAI API. It's good - decently quick and gets answers correct for our football questions. Perplexity is a tempting offer too - they tout similiar performance to 4o-search, while being 5x cheaper. I also came across the OpenDeepSearch framework from [this paper](https://arxiv.org/abs/2503.20201), which claims superior performance to both of 4o-search and Perplexity, but frankly... the engineering effort isn't worth the extra few percentage points of accuracy.

Overall, the final cost for an hour comes to about a dollar. The big spender is the search model, making up >90% of the costs. Nevertheless, a dollar is pretty good going. 

## Next

Real-time suggestions of *what hosts should say* - anecdotally, I've heard that Steven Bartlett uses a similar system to tell him what he should say to make viral clips, for his Diary Of A CEO podcast. I imagine this would need a heftier model, and possibly even some model post-training. Short-form content is a huge opportunity for any podcast to pick up new listeners, so any help is worthwhile.

To close this shorter piece off, I want to end with a more meta point. People say that to learn technologies, you need to build things. I think this is only part of the puzzle - you need to build things, but they have to solve problems for real people. Doing a project 'just for the sake of learning' is a constant uphill battle, and sidesteps the entire point of any engineering, which is to solve problems. You might also find there's a market for it. 

***

May 29th, 2025.