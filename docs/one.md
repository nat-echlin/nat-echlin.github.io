# Managing a million dollar pool with 15k lines of Go.

LightSpeed Trading was my first serious project. People gave us their money, and the trading bot made it into more money. Easy. I worked with a non technical friend, who taught me a lot about business. At our peak, we had over 500 users, and the bot was trading with over a million dollars of our users' money.

This blog is mostly aimed at engineers - if you're technically inclined, I hope the 'technical side' section makes you think one of, 'wow this guy is fucking dumb' or 'these are some good points'. Either's fine.

The code for the bot is linked below.

## How did it work.

It copied other people's crypto derivatives trades - we realised that there some exceptional traders out there, and they made their trades public. The logical next step is to copy them, and make those same gains. While the market was up, it worked frighteningly well. Our best day saw $40,000 made over 3 minutes. When the markets turned down, our userbase fell from over 500 to about 15 active users.

## Why did it fail.

LS went into production Feb '23, and EOL'd September '23. We lasted just under a year from the first alpha release. Summer '23 saw a downturn in crypto, and that only meant a bigger downturn in the derivatives market. The traders we copied were significantly less profitable, so we were too. A lot were in the red.

What didn't help is that I hadn't hired fast enough. If you desperately need to hire, it's far too late. It takes _at least_ 3 months for a full time engineer to meaningfully contribute to a project, and we didn't have that breathing room. And I was in full time education - even I wasn't the full time engineer that we needed.

If we'd hired better, the company might've been more resistant to the shock that was the downturn in crypto. With a stronger development team, we could've pushed out more features - which contributes to - **why will people pay you:**

- They are getting value now.
- They really, really, really believe that they will get value soon.

For us, that meant to get (& keep) users, we had to be making money for them right now, or they were certain that we'd make them money soon. If we'd have pumped out more features, could we have kept that belief up? Maybe.

## The technical side.

(this part is entirely uninteresting if you don't care for engineering)

https://github.com/nat-echlin/lightspeed-trading--clean

Above is the sanitised repo, completely open sourced. It's awful, but it's awful for a reason.

Originally, the bot was written in Python, and I compiled it into a Windows executable which was sent out to users (what the fuck?). I gave instructions on how to set up a EC2, people downloaded the bot onto it, stuck in their license key, and they were pretty much done. Each user was independent - their bot would scrape Binance, and if it spotted a trade, the bot would execute that trade on ByBit. It worked.

But a google search would've given step by step instructions on how to decompile that exectuable into the raw Python code, and for what was supposed to be a competetive business, that's not acceptable.

So, I made the decision to rewrite it in Go, having never used Go before, and over five days of not leaving my flat - it was done. At this point I think it came to about 6 or 7k lines. This refactored the model so that all trades were executed from a central EC2, and users could login to the bot via a web dashboard, and set their config from there. This worked much better. Our trade execution speed doubled, so users were more profitable. We were hitting Binance hard, making ~100 requests per second. These requests were routed through the fastest proxies I could buy.

Go as a language is beautiful, and the productivity you can reach using it is second to none. But I'd never used it before, so during the rewrite, the bot was still in production - I didn't have time to learn things that weren't strictly necessary. For example - while that repo does include a custom built crypto payments processor API, it doesn't include folders - because I didn't know how to import from non sibling files (and still don't). Likewise, while it does have 5000 lines of unit & e2e tests - they're all in one file, `main.test`.

#### Is that a good attitude.

For what LS needed, **yes**. We were moving way faster than our competition, one of which was a team of 3 senior engineers - while they were making Jira tickets, and story pointing their bugfixes to deal with an API deprecation from Binance, our fix was already deployed and our users were making money.

However, for a team, this sort of attitude doesn't work as well. Being comfortable with significant tech debt is only possible when each engineer knows the codebase inside & out, which unfortunately isn't possible with more than one engineer (unless you're streaming commits to the develop branch into your sleeping engineers brains... startup idea for you somewhere in there).

#### How do you decide what features to build.

Firstly, don't build a feature because a user asks for it. Don't build a feature because your non technical teammates, bless them, are asking for it. Your time is too precious. Each feature you decide to build **needs** to directly benefit your users. Multiple times, I wasted a week or more on a feature that sortttt of helped the product - but in practice, it didn't. It can seem overwhelming when there's hundreds of support tickets asking for things, but you need to cut the crap stuff out. Say, 'No dearest user, I will not build that.'

To give an example; the bot would store trades made (by the traders we copied) in a Postgres table, and each week a Cron job would sort them out into a human readable Excel table, then send that into a Discord server. For 'analysis'. Round of applause for whatever idiot (me) thought that was actually something we needed.

The long and short - **when deliberating on a new feature, go back to the core mission**. Does this new feature fulfill that mission? If you have to word it in a certain way, or do some mental gymnastics, or even just try and convince others - the answer is no. Like above, with the analytics: more trader data -> better insights to who's a better trader -> better than what's already available on the Binance dashboard? ehh.. -> don't build.

This seems obvious, but I see it in products I've worked on in billion dollar companies.

#### Shit code and DRY.

I've spoken to lots of much better engineers than me about this (regarding DRY), and the conclusion I've come to is - kinda. [Grug](https://grugbrain.dev/#grug-on-dry) gives a much better explanation than what I could. The LS codebase is not good for DRY principles - see `router.go` - 140 lines of crap:

```go
router.Handle("/user/listBots", corsMiddleware(v.authoriseJWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }
    OnListBots(w, r, dbConnPool, dbEncryptionKey)
}))))
router.Handle("/user/updateSettings", corsMiddleware(v.authoriseJWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }
    onUpdateSettings(w, r, dbConnPool, dbEncryptionKey, false, lmc)
}))))
router.Handle("/user/getLicense", corsMiddleware(v.authoriseJWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodGet {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }
    onGetLicense(w, r, dbConnPool)
}))))


... etc etc ... you get the point.
```

Why the fuck was this not dealt with????

Again this goes back to the attitude of not caring about it unless it's absolutely necessary. At the end of the day, **you are writing software to provide value to users & make money**. Copy and pasting that block saved me time - net positive.

#### Fear.

Some things are pretty scary to write. For example; authentication & authorisation, payment processors, trade executors. Get auth wrong, and suddenly you have very angry users. But you have to just do it. You will make mistakes, and hopefully you'll be able to cover them up. E.G., I fucked up the trade executor, and broke one of the pre-trade safety checks - it looked at asset price difference between different exchanges, ByBit and Binance - too high a difference, no trade. I thought I was fixing it, but instead the limit for 'no trade' was increased by 100, ie it would never be hit. **We lost ~\$8,000 because of that mistake**. But who cares. The teacher was $8,000, the lesson was _write more tests for the scary parts_.

###### The final tech stack.

If you like boring lists - the best solution I found was a monorepo running on an Ubuntu EC2. Before then it used Lambda, DynamoDB, with some continuous processes on an EC2. The monorepo solution was easier to deal with and build upon. It used Postgres & MongoDB (should've been all Postgres). The frontend was built with Next.js (mid move), and we hosted it on Vercel (smart move). Vercel made auth super easy, since they handled JWT creation - the backend just had to authorise them. Languages, obviously Go for serious computational work. But JS plays nice in a Lambda.

## The end -

LightSpeed is the most fun I've ever had. Sitting in lectures in my first year of university, and watching the bot make 6 figure trades, is easily the coolest experience I've had. Building something that real people actually want to use is an incredible feeling, and makes the 2am sessions worth it.

My advice for an engineer - just build something, you can probably figure it out. This picture says that better than words can.

![image](skill_issue.png)
