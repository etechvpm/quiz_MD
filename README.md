# Ocean Quest

Multiple-choice practice quiz for marine biodiversity competition prep. Students pick A–D for each question; after choosing, they see whether they were correct and a related fact. Questions are shuffled into a new random order every time the quiz starts.

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
2. Choose A, B, C, or D
3. Instantly see Correct/Incorrect, the right option, and the fact
4. Continue through all 112 questions (random order each run) and review misses on the results screen
