---
layout: default
---

# Marketing the consumer social model - selling emotions.

The B2B (selling to other businesses) model is a much easier model to understand than B2C (selling to consumers). When you sell to another business, you are selling money. I first point to LightSpeed. We were selling profits. Pay us a licence fee, but you'll make more than that back. We sold money. 

Other B2C examples all follow this concept but at different levels of removal. Keeping it simple, AWS EC2 - don't spend money on hosting your own servers, spend it on us and you'll be net positive. Therefore, selling decreased costs. Selling profit. Or, we can go further and look at Slack. By making quick, asynchronous communication easier, people spend less time waiting for emails, have an easier UI to navigate, etc. Collaboration improves - your employees are more productive, and then produce more deliverable work, leading to more revenue. Selling profits, assuming that the Slack costs are low enough.

But the B2C social model is entirely different. You aren't selling money anymore. You are selling emotions.

## Selling emotions.

Our use of consumer social apps (see Instagram, Twitter, LinkedIn, etc) can be split into two activities. 

- Creation. First, we need to accept that *people post for themselves*. To feel funny, to feel smart, to look hot, to look rich. Et cetera. This concept has been written about a lot. [Oxford Academic](https://academic.oup.com/edited-volume/41352/chapter/352512559?login=true), [Psychology Today](https://www.psychologytoday.com/us/blog/digital-world-real-world/202108/self-presentation-in-the-digital-world). This isn't a bad thing though, it makes sense, and it's what these apps are specifically designed for.
- Consumption. There must be some element of utility. We go on Twitter to laugh, or as it leans further into the news category as X, to see what's going on around us. And I do actually get to see what my friends are up to on Instagram.

It's quite simple to work out which of these emotions any app is selling. Twitter sells feel funny + feel smart, LinkedIn sells feel smart + feel proud. You only need to open LinkedIn for 30 seconds to see someone bragging about their latest achievements.

The utility on the consumption side can't be ignored, it's as necessary as the emotions on the creation side - LinkedIn does, actually, help some people get jobs. I've noticed that the advertising of these apps is entirely based on the utility / consumption side, not giving a moment to the creation side. There's lots of interesting takeaways from that I'm sure - for one, they certainly know that they're selling emotions. So why don't they advertise it as such? Perhaps they think they'll be viewed as dystopian - probably rightly so. It's also true that utility is more consistent across people, rather than emotions which are innately inconsistent across people (by and large), so marketing strategies can safely go for the safer route of utility rather than emotions. 

## My work on Prospect.

use-prospect.com

Prospect is software for events. I call it 'pre-networking'. Taken from the landing page:

> An introduction before you meet.
> Prospect ensures your time at events is spent on conversations that matter.
> We connect you with worthwhile prospects before you step into the room.
> 
> Why?
> 
> Prospect solves the two issues with networking at an event - timewasting, and fear.
> 
> The uncomfortable fact is that most people are not worth meeting at an event. But to work out if someone is in fact worth meeting, it takes at least ten minutes, which are entirely wasted in most cases. Then there's the first few minutes of the encounter - first it's niceties, then you're trying to work out what questions to ask, to be able to probe deeper and have a meaningful discussion.
> 
> Then the fear - we all come to an event a bit nervous, and because of that don't meet the right people. It's easy to hang back, or to do the opposite - to accept quantity over quality, by just aiming for 'meeting five people' or 'getting five business cards'. But these connections aren't worthwhile. We should want just one or two new people that we know we'll continue with.
> 
> How?
> 
> Tinder, for professionals, localised to a specific event. Enter your profile, and swipe yes or no on other attendees.
> 
> When you get a connection with someone else, each of you knows for certain that you both want to meet. You skip the surface level questions, and get right to the juice.

### Selling emotions?

Prospect hits on a few - when you make your profile, you get some warm pride, thinking - you know what, I have done some cool stuff. Then when you get a little tick, after saying yes to someone - you know that someone you'd like to meet, also wants to meet you. Kudos to dating apps for realising how much money that was worth.

This ties into the utility side of Prospect. That sense of validation reduces the anxiety of going to an event, since you know you've at least a couple of people you want to talk to there. Then, when you're actually at the event, you get higher quality conversations with those people, and hopefully leave with what's actually a meaningful connection.

### Why will Prospect fail.

Execution. 

VC's like it, a lady I'm speaking to who's been running events for years loves it. But consumer social apps are fucking hard to get right. Luckily for me, there isn't an incumbent in the space, so I don't have to juggle that. If there was, it wouldn't be worth even trying. 

But that doesn't mean it'll 'just work'. Social apps take a long time to take off, because the utility of them is proportional to how many other people use them. And since the number of people using Prospect is essentially reset for each event, it'll be worthless for the first signup, then slowly get more and more useful with more people signing up. 

So for it to succeed at an individual event, it'll need absolute buy-in from the organisers, who can then push it on the attendees over and over again in the run up to the event. That level of buy in is almost unheard of, especially as they don't really stand to gain from people using it. Maybe I should be paying organisers to use it... 

A fundamental point which is true about all consumer apps, not just consumer social, is that **people just don't care**. You need to convince them to care - aka, marketing. The email to events, the landing page, all through the user signup flow, users need to be convinced that they're going to get value from it. Every possible element of friction needs to be removed. One way I've done this so far is with Google OAuth - the little button on a site that says 'Login with Google' increases retention by a massive factor, solely because people don't have to think about 'what email do I need to enter here', 'what should I set my password as'. Then in user signup, when people enter their profile - I want an 'Import from LinkedIn' option so users don't need to think about manually making their profile, which is a chore.  

## When does selling emotions fail?

So many companies have tried to create a 'tinder for finding friends'. Every time, it fails. For some reason, the warm happy feeling we get from 'x person wants to be friends with you' just isn't warm and happy enough for us to use it. This is probably interesting, but I don't really know enough about psychology to go any further. 

Really, I think the only takeaway I have from that, is that if you really decide that you're just selling emotions, they need to be pretty powerful ones. This lines up with dating apps working, but finding friends apps not. 

## The engineering side of selling emotions.

We need to be able to work out when we're trying to sell an emotion, and it isn't working. The easiest metric we have for this is retention - at what points in the user flow are people commonly falling off at? We don't have many places to collect data from, before they get to the site (unless you want to use tracking pixels in emails as a rudimentary technique), so we can just focus on retention from when they get to the landing page. So how can we get these metrics from there on?

The answer is analytics trackers - we can't rely too much on our intuition for our retention engineering, since if something's not working, our intuition's already failed. If we can get the number of people who arrive at a page, vs the number of people who continue onto the next part of the flow, we can identify any significant discrepancy and try to work out specifically what's going wrong. There's tons of microservices that will do this for you if you hand over some coin - but it's pretty basic and you can trivially implement the data collection systems yourself.

On a request from a user, give them a tracking cookie as a first step and add a row to your tracking db table (or obviously don't if they already have one). Most web frameworks have things that make this easy, in Sveltekit I'm using server side hooks. Now we know that any request will have this cookie, so on every page navigation, just update some bool for the respective column to that page, and respective row to that cookie. Or - the better way of doing this is to use a nullable timestamp column, and rather than flipping the bool, update it to the current timestamp. Now you can roughly see time spent on each page. 

Once you've done this, you can see which pages users tend to click off of, then you can go into the page and work out which parts specifically need work on. Often this will be a page that is asking the user for a lot of input, of which they don't immediately get value from. In Prospect, that's clearly profile creation. 

Once we have analytics engines implemented, we can do lots of fancy techniques like A/B testing, which'll help us properly land on a fundamentally good product.

## The end -

I've learnt lots from building Prospect. About marketing, about front end engineering, and the entire Cloudflare cloud platform (which is super good, clear of AWS / GCP in terms of pricing and definitely usability). 

And I enjoy writing, so it's been fun to write this. I've almost certainly made points in here that I'll find out I was wrong about soon. 

To end similarly to the last one - keep building new things. 

***

Oct 17th, 2024.