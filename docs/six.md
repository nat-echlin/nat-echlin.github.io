---
layout: default
title: "Compute & fear."
---

The market for compute is the hottest battleground in the world. Every day, we're bombarded by stories like [Figure AI committing $3.5B to Nscale](https://www.figure.ai/news/figure-and-nscale-sign-strategic-partnership), almost twice the $1.9B that Figure's ever raised; or Anthropic spending at least [$290M a week](https://techcrunch.com/2026/05/20/anthropic-will-pay-xai-1-25-billion-per-month-for-compute/) with xAI alone. 

It's old news that we're globally supply-side constrained. We can rattle off the reasons, but broadly it's that the demand for compute exploded accompanying the "transformer scaling just works" scenario. And the workhorse, the top-end GPU, is probably the most complicated mass-produced technology humanity has ever put together. 

But scarce markets are well-documented; prices go up, so what. The buyer with the most money wins. Compute is stranger than that, because that scarcity has uncertainty along all axes; **compute is driven more by fear than scarcity**. 

### Neolabs

When I'm talking to {todays-newest-neocloud}, I don't know whether the 10 week lead time is accurate, or whether that's assuming the optical transceivers will be delivered early. I don't know if the 1.8Tb/s NVLink speeds they quote me are accurate, or whether the Docker setup will stop me from doing container-in-container. So I'm scared - if I miss something here, I'm contractually locked into paying millions a month for a sub-par learning substrate.

Even ignoring concerns over quality, neolabs can't remotely forecast how much compute they'll need. A standard lead-time from a respected provider could be 3, 6 months or longer. So the lab has to project their requirements to that point in the future, when already they're thinking they don't have enough today. You're given two choices:
- underbuy; your research stalls, or you pay hyper-premium prices for spot instances. 
- overbuy; your runway might end before you have grounds for the next raise.

And we can trace this fear up the chain. Let's walk up, to the neoclouds next & ending with the big daddy, and source of all that is good and evil, TSMC. 

### Neoclouds

As a neocloud, my gamble is that compute prices don't go down. I'm usually raising debt to be able to build out new datacenters, and I hope that Nvidia thinks I'm worth investing in - and they'll cut me a nice deal for some Blackwells. Then I really have to hope that I can curry enough favour with Jensen for him to give me good shipment dates for Rubins! 

If compute demand stays the same, I'm OK - my margin is selling shorter-term rentals on the hardware that I'm getting cheaper rates on. I'll orchestrate construction around locations with cheaper energy and easy permitting, and win. If compute goes up, I'm doing even better! Now I get the added margin from price at t_purchase to today. But if demand drops - or even if demand growth slows - everything detonates. Suddenly, I'm forced to start selling compute at a rate that can't satisfy the financing I agreed to last year. 

- we're seeing the edges of this model already; [Nvidia's putting pressure on insurers](https://finance.yahoo.com/technology/ai/articles/nvidia-looks-insurers-shoulder-losses-233056235.html), to cover lenders' losses on neocloud loans.

Given that prices are expected to continue rising, if a cloud locks in a long contract with a lab today, they worry that they're needlessly limiting their own potential margins. They'd rather hold capacity back to drip-feed it, or sell it on a shorter contract. This also explains the lab's uncertainty with lead-times; it stems from the cloud's fear about price, not just the physical requirements imposed by delivery of optical transceivers. Furthermore, from the neocloud's perspective - the labs' overbuying of compute (out of the aforementioned uncertainty) looks like a rising tide of demand. Overall, this fear is self-fulfilling, where everyone's acting on it and making prices rise even further.  

### Nvidia, TSMC

Nvidia has the same fear as everyone else; it has to commit to buying TSMC's wafers & capacity years ahead, which is the exact same underbuy/overbuy bet the neoloabs make, just much bigger. As well, it has to worry about competing accelerators:

- Google is now pushing TPUs commercially, having mostly kept them internal during their development.
- Amazon's Trainium (which is really an inference chip) seems to be showing signs of life.
- Huawei chips are in use by all the Chinese labs, alongside Nvidia's.
- and AMDs chips are still... just AMD chips.

Luckily on the software side, CUDA is still so far ahead of the pack that Nvidia probably isn't losing too much sleep over potential hardware competitors. Its most imminent worry is demand shocks in either direction. 

Nvidia's answer is to sell reassurance. 

First, it invests in its own customers down the stack. Neoclouds, of course, but also frontier labs like OpenAI ($30B) and Anthropic ($10B). Clearly there's a bit of a circlejerk going on here - almost all of this investment will go back to Nvidia in a straight line given how much labs spend on compute - but through the lens of comfort-provision it's an elegant move.

Beyond that, Nvidia ultimately decides allocation across customers. Who gets Blackwell racks in volume, who'll get Rubins first - kingmaking levers that only Nvidia has the ability to pull. If you're one of Jensen's chosen few, many of your fears are alleviated.

TSMC sit in a more unique position. Their own success is of course tied to the same demand & the same fluctuations on that demand, but their commanding seat allows them to demand huge prepayment before even starting construction. While they're still playing it fairly safe (~30% CapEx increase YoY), they're not ramping up as much as we'd like. 

This almost-fully-capped downside is the first we've seen, and unfortunately it's also what screws everyone else.  

- TSMC demands prepayment, 
- Nvidia gives allocation to whoever commits big and early, so neoclouds borrow to commit.
- Lenders want guaranteed revenue, so neoclouds need labs to sign long contracts.
- Neolabs have nobody below them to pass it to, so they carry it, and overbuy as insurance.

Pushing this risk down the chain isn't the same as getting rid of it; it's piling up on the weakest balance sheets, and when those sheets fall over, it all comes back up the chain. 

### Comfort wins

I believe any play which provides comfort will win, and myriad examples show themselves to us. 

- As an alternative to managed-cluster compute, a less sophisticated lab can opt for Tinker. By paying per token, they avoid the always-on, always-paying side of the monthly-billed cluster.
- For inference more generally, we use a dedicated inference cloud like Fireworks / Baseten.

Clearly these are the trivial examples, built on the same ideas as one would have timeshare on a mainframe, but I see it materialise elsewhere. SemiAnalysis provides expensive reassurance, with its ClusterMAX free sample being the public release to hook us sorry neolabs in.

SF Compute is another example, a commodity market with physical delivery. Buy or sell nodes in any volume, on any timescale. On top of that, Ornn; sitting a layer above, a pure financial market with no physical delivery. It offers standardised, cash-settled futures & derivatives on compute hours across cluster configurations. The glaring flaw with these is that <u>compute isn't a commodity</u>. 

While the chips are standardised (an H100 SXM is an H100 SXM universally), the cluster itself <u>isn't fungible</u>; people aren't just buying H100 hours, they're buying the compute plus the working fabric plus storage attached, plus maintenance support and much more. H100 nodes with no InfiniBand and a crappy NFS are worth dirt.

Furthermore, contiguity has its own value that is wholly separate from commoditisation; a large block available soon is worth far more per-GPU than the same number scattered across regions & providers. 

---

The GPU is the easy part. What we're really buying is everything around it: a fabric that works, storage that keeps up, a block that's all in one place, and a delivery date that doesn't slip. None of that shows up in a price per GPU-hour, which is why a dollar off a GB300 hour won't even get me on a call. Figure didn't commit $3.5B because it needed 100,000 Rubins in 2027. It committed because the alternative was being afraid of not having them.

In a market priced on fear, the cheapest compute doesn't win. The most comforting does.

***

Oct 5th, 2026.



