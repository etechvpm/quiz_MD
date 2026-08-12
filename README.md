# Ocean Quest

Practice quiz for marine biodiversity competition prep. Students type free-form answers; after each question they see whether they were correct and a related fact.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Quiz flow

1. Start from the welcome screen
2. Type an answer for each question
3. Click **Next** to reveal correct/incorrect status plus the fact
4. Continue through all 112 questions and review misses on the results screen

Answer checking is intentionally flexible (synonyms, partial matches, and “any N of …” lists where the source text allows alternatives).
