# Major Project Reflection

## What advice would I give to myself if I were to start a project like this again?
- Picking this game to code is a mistake. It is ungodlily complicated because there are so many different cases you have to account for and your code would be bugged if your logic is fundamentally flawed or you forgot some cases, or the logic does not translate to similar things, or you make a dumb mistake somewhere. All these things happen and it takes too long to debug btw my comments are fine it's just I forget the math because of the quantity.
- Make sure your logic is fundamentally sound so you don't try to fix things along the way and then figure out your logic is fundamentally flawed and you have to restart.
- pay attention to the error it gave you that would prevent the tragedy of me spending 2 hours assuming that "[{gravity}]" is the same as "[gravity]"
- spend more time on the interface. I spend too much time doing math and now the interface just looks like garbage.
- The very very nice-to-have section is a pipe dream that is never happening.
- do more attacks bug fix later
- Not plan out exactly but just what the code approximately be like and that is probably enough to tell me that picking this game is a bad decision in the first place.

## Did I complete everything in my "needs to have" list?
- Yes, surprisingly because I have low expectations
- I also managed to complete one part of my "nice to have" for example having the screen adjust to the right size for the most part(Everything except health bar)

## What was the hardest part of the project?
- Gravity (self-explanatory). Moving without gravity is easy. moving with gravity goes into this function where you have 4 ifs and in each of the 4 ifs there are 6 ifs and there are even more ifs in the 6 distinct ifs and the ifs are on average 4 different true or false statements stapled together. The only reason I survived that is I have good comments so I didn't completely forget what the statements even meant.
- Bugs. There are so many 30-minute bugs and half of them are so dumb that just wastes my life. I will never forget them for the rest of my life because of the trauma they have caused me

## Were there any problems you could not solve?
- I actually could solve every technical problem but the problems I could not solve are examples like these.
- so my current function contains all the bone in order of when is it loaded but not the time at which it should be deployed. So there is a problem where sometimes I have to shoot the third attack early since it travels slower and the first attack last because it travels the fastest. If you don't understand what I'm talking about it doesn't matter. Because I didn't end up making that level work. The point is sometimes what I want to do is fundamentally incompatible with my current framework. Another example is loading multiple things at the same time so I have to completely bypass that by using the recursive function to simultaneously execute. The upside is I do not have to completely rework my current system. The bad part is it causes so much pain and suffering that I probably have a better time just reworking the system even if that route takes more time. In conclusion, the hard logic and bugs with enough time they are all easy to solve but updating the system and making it compatible with what I want it to do is the only problem I can't solve.
- Also there is this mystery bug where the first bone that is ever sent will always be bugged I bypassed this problem by making the first bone invisible and with no damage but the bug is still there and why is there bug is still a mystery.