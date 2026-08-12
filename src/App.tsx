import { useEffect, useRef, useState } from 'react'
import { questions } from './data/questions'
import { checkAnswer } from './utils/checkAnswer'
import './App.css'

type Phase = 'welcome' | 'answering' | 'feedback' | 'results'

type Result = {
  questionId: number
  correct: boolean
  userAnswer: string
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState('')
  const [lastCorrect, setLastCorrect] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const question = questions[index]
  const total = questions.length
  const score = results.filter((r) => r.correct).length
  const progress = phase === 'welcome' ? 0 : Math.min(((index + (phase === 'feedback' || phase === 'results' ? 1 : 0)) / total) * 100, 100)

  useEffect(() => {
    if (phase === 'answering') {
      inputRef.current?.focus()
    }
  }, [phase, index])

  function startQuiz() {
    setPhase('answering')
    setIndex(0)
    setDraft('')
    setResults([])
    setLastCorrect(false)
  }

  function submitAnswer() {
    if (!draft.trim()) return
    const correct = checkAnswer(question, draft)
    setLastCorrect(correct)
    setResults((prev) => [
      ...prev,
      { questionId: question.id, correct, userAnswer: draft.trim() },
    ])
    setPhase('feedback')
  }

  function goNext() {
    if (index >= total - 1) {
      setPhase('results')
      return
    }
    setIndex((i) => i + 1)
    setDraft('')
    setPhase('answering')
  }

  function onKeyDown(e: { key: string; shiftKey: boolean; preventDefault: () => void }) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (phase === 'answering') submitAnswer()
      else if (phase === 'feedback') goNext()
    }
  }

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="rays" />
        <div className="waves">
          <span />
          <span />
          <span />
        </div>
      </div>

      <header className="topbar">
        <div className="brand-mark">
          <span className="brand-orb" aria-hidden="true" />
          <span className="brand-name">Ocean Quest</span>
        </div>
        {phase !== 'welcome' && (
          <div className="progress-wrap" aria-label={`Progress: question ${Math.min(index + 1, total)} of ${total}`}>
            <div className="progress-meta">
              <span>
                {phase === 'results' ? total : index + 1} / {total}
              </span>
              <span>{score} correct</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </header>

      <main className="stage">
        {phase === 'welcome' && (
          <section className="hero panel-enter">
            <p className="eyebrow">Marine biodiversity competition prep</p>
            <h1 className="hero-title">
              <span className="hero-brand">Ocean Quest</span>
            </h1>
            <p className="hero-lead">
              Type your answer for each question. After you continue, you’ll see whether you were right — and the fact behind it.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={startQuiz}>
                Begin quiz
              </button>
              <p className="cta-note">{total} questions · typed answers</p>
            </div>
          </section>
        )}

        {(phase === 'answering' || phase === 'feedback') && question && (
          <section className="quiz panel-enter" key={`${question.id}-${phase}`}>
            <p className="q-label">Question {question.id}</p>
            <h2 className="q-text">{question.question}</h2>

            {phase === 'answering' && (
              <div className="answer-block">
                <label className="sr-only" htmlFor="answer">
                  Your answer
                </label>
                <textarea
                  id="answer"
                  ref={inputRef}
                  className="answer-input"
                  rows={3}
                  placeholder="Type your answer here…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  spellCheck
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitAnswer}
                  disabled={!draft.trim()}
                >
                  Next
                </button>
              </div>
            )}

            {phase === 'feedback' && (
              <div className={`feedback ${lastCorrect ? 'is-correct' : 'is-wrong'}`}>
                <div className="feedback-banner">
                  <span className="feedback-badge">{lastCorrect ? 'Correct' : 'Incorrect'}</span>
                  {!lastCorrect && (
                    <p className="expected">
                      <span className="expected-label">Expected answer</span>
                      {question.answer}
                    </p>
                  )}
                  {lastCorrect && (
                    <p className="expected expected-ok">
                      <span className="expected-label">Model answer</span>
                      {question.answer}
                    </p>
                  )}
                </div>
                <div className="fact">
                  <p className="fact-label">Fact</p>
                  <p className="fact-body">{question.fact}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={goNext} autoFocus>
                  {index >= total - 1 ? 'See results' : 'Continue'}
                </button>
              </div>
            )}
          </section>
        )}

        {phase === 'results' && (
          <section className="results panel-enter">
            <p className="eyebrow">Quiz complete</p>
            <h2 className="results-title">
              <span className="hero-brand">Ocean Quest</span>
            </h2>
            <p className="score-line">
              You scored <strong>{score}</strong> out of <strong>{total}</strong>
              <span className="score-pct"> ({Math.round((score / total) * 100)}%)</span>
            </p>
            <p className="results-lead">
              Review any misses below, then take another pass to lock in the facts for competition day.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={startQuiz}>
                Try again
              </button>
            </div>

            <ul className="miss-list">
              {results
                .filter((r) => !r.correct)
                .map((r) => {
                  const q = questions.find((item) => item.id === r.questionId)!
                  return (
                    <li key={r.questionId} className="miss-item">
                      <p className="miss-q">
                        Q{q.id}. {q.question}
                      </p>
                      <p className="miss-yours">
                        Your answer: <em>{r.userAnswer || '—'}</em>
                      </p>
                      <p className="miss-ans">Answer: {q.answer}</p>
                      <p className="miss-fact">{q.fact}</p>
                    </li>
                  )
                })}
            </ul>
            {score === total && (
              <p className="perfect">Perfect score — every answer landed. Ready for the competition.</p>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
