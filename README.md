## Running the app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

It is also hosted at [https://kasagi-labo-assesment.vercel.app](https://kasagi-labo-assesment.vercel.app)

## Known limitations

- Favourite animes are stored in session storage. They will be persisted only in the current tab (won't be shared across multiple tabs if open) and won't persist when browser is closed.
- API calls to Jikan API is rate limited. While fallbacks are in place to retry (3 times max, 1 sec interval), there might be instances where certain calls fail. Refreshing the page should fix it.
- API calls are not cached, so repeated navigations will re-fetch pages. Using API caching tools like RTK Query should overcome this.

## Thought process

1. Simplicity & maintainability:

- Used React Context for state management to reduce prop drilling
- Created hooks to fetch anime list to encapsulate logic behind api calls (adding more anime into existing list, retry mechanism, etc)
- Used simple and lightweight UI libraries like shadcn and Tailwind to speed up development while keeping app lightweight

2. Performance

- Prevented unnecessary re-renders by careful use of effect dependencies
- Used lightweight libraries like shadcn and Tailwind
- Used React performance optimization hooks such as useCallbacks manage renders

3. Responsive UI

- Built components to scale between desktop and mobile views
- Added subtle animations and loading skeletons throughout the app to enhance user interaction and make the experience feel more responsive

4. Resilience

- Added retries for API requests 3 times with a 1-second delay so small network hiccups don’t cause unnecessary errors
- Added error UI and automatic retries to let users recover without a hard refresh

## Architecture desicions

1. NextJS

- Built-in routing simplifies navigation
- Great image optimization out of the box
- Easy deployment (Vercel)

2. React Context

- Lightweight global state management without extra libraries
- Keeps the app simple, predictable, and easy to build and maintain

3. shadcn and Tailwind

- Works seamlessly with together, requiring lesser initial setup
- Speed up overall development - easier to tweak and prototype with
- Small footprint contributing to better perfomance
- Maintain consistent styling and spacing across app

Overall, I also chose this tech stack because I’m experienced with these tools and can build reliably and efficiently with them.
