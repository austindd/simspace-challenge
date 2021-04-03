# SimSpace Code Challenge

## Development Quick-Start

There are 2 ways to start up the dev environment:
  1. In one terminal window, run `yarn dev:server` to start the API proxy server, which allows you to get around any CORS issues during development. In a second terminal window, run `yarn dev:client` to start the usual CRA dev server, which should open the app in your browser.
  2. Run `yarn dev`. This executes the `dev:server` and `dev:client` scripts in parallel in a single terminal window.

## Architecture

Just a few notes about the development workflow... The API we are fetching from will not allow requests from `localhost` due to CORS issues. So I hacked together a proxy server (located at `./server/api-proxy.ts`), so we are fetching the data through that server during development. For production, I would just specify the real endpoint in the `.env` file.

As for the front-end, the architecture is just a set of relatively independent components, which use a sort of state-reducer pattern for state management. This "reducer" is really a React context provider, which handles actions from consumers, and propagates the state to each component that needs it.

As for CSS styles, I really like libraries like Bootstrap and Tailwind, but I decided to keep it simple and go with plain CSS. The class names could be cleaned up a little bit, but I tried to use the BEM convention, so it's relatively clear in my opinion.

### State Management

The state-management could be accomplished in a simpler way with a true reducer pattern, like `React.useReducer` or `redux`. However, I started with a context provider, and rather than rebuilding it from the ground up, I ended up evolving it into a makeshift state-reducer. If I had more time, I would probably refactor this, but it works well for now.

### Data Models

As for the data models themselves, I defined the core data types and helper functions (decoding/encoding, remote fetching, etc) in `./src/data/api-data.ts`. I don't use any classes, preferring to be as functional as possible. Instead, everything is organized into namespaces/modules.

It's also worth noting that I'm using `fp-ts` with `io-ts` decoding the data from the API. This turns out to be a very nice sanity check for me, since I know I can trust the data that passes through the decoders. It also allows me to isolate errors due to incorrect assumptions about the API data.

### Programming Style

I strongly prefer functional programming, so almost everything is done in a functional style. There are a few bits of code written in imperative style where it makes sense, but it's rare.

I make heavy use of `fp-ts`, partially because I know that's what SimSpace tends to use, but also because I really love the library. I mostly used the `Option`, `Either` and `TaskEither` modules, but a case could be made for other uses. I tend to shy away from category-theoretical stuff, especially when making a first pass at a problem. I am fine using abstractions like monads and monoids, but you won't find them here.

One nice result of using the `Option` type in my state models was that I can easily differentiate an *uninitialized* state from *invalid* or *empty* states. If it's `None`, then I know it's simply not set.

### Bonus Features

There are a couple of additional features that were not specified:
  1. I added a *'fuzzy match'* feature that attempts to search for dog breeds by looking at similarities between the search term and the breed names. This is based on the classic *Levenshtein-distance* algorithm. I tried to make it a bit smarter by moving *exact* substring matches to the front of the search results, and using the Levenshtein-distance rankings for the rest.
  2. I added a toggle switch to switch between the normal search (exact substring match) and the fuzzy search, so you can play around with both.
  3. The loading icon is really nice-looking and animated. I used a library called `react-loading-spinners` for that.

## Final Thoughts

I haven't had a ton of experience implementing search features, but this one was fun and interesting, especially with all the dynamic element changes on the screen. It pulled together a lot of concepts, so I think it was a suitable challenge. It was also really nice to play around with `fp-ts`, since I haven't been able to use it a whole lot for work purposes. If it turns out that I'm a good fit for SimSpace, then I definitely look forward to perks like this.
