import { useState } from 'react'
import { questions, type Choice, type Question } from './data/questions'
import './App.css'

type Phase = 'welcome' | 'answering' | 'feedback' | 'results'

type Result = {
  questionId: number
  correct: boolean
  selected: Choice
}

const CHOICES: Choice[] = ['A', 'B', 'C', 'D']

function shuffleQuestions(list: Question[]): Question[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [deck, setDeck] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<Choice | null>(null)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [results, setResults] = useState<Result[]>([])

  const question = deck[index]
  const total = deck.length || questions.length
  const score = results.filter((r) => r.correct).length
  const progress =
    phase === 'welcome'
      ? 0
      : Math.min(((index + (phase === 'feedback' || phase === 'results' ? 1 : 0)) / total) * 100, 100)

  function startQuiz() {
    setDeck(shuffleQuestions(questions))
    setPhase('answering')
    setIndex(0)
    setSelected(null)
    setResults([])
    setLastCorrect(false)
  }

  function chooseOption(choice: Choice) {
    if (phase !== 'answering' || !question) return
    const correct = choice === question.correct
    setSelected(choice)
    setLastCorrect(correct)
    setResults((prev) => [
      ...prev,
      { questionId: question.id, correct, selected: choice },
    ])
    setPhase('feedback')
  }

  function goNext() {
    if (index >= total - 1) {
      setPhase('results')
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setPhase('answering')
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
              Choose the best answer for each multiple-choice question. After you pick, you’ll see whether you were right — and the fact behind it. Questions appear in a new random order every time.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={startQuiz}>
                Begin quiz
              </button>
              <p className="cta-note">{questions.length} MCQs · shuffled each run</p>
            </div>
          </section>
        )}

        {(phase === 'answering' || phase === 'feedback') && question && (
          <section className="quiz panel-enter" key={`${question.id}-${phase === 'feedback' ? 'fb' : 'q'}`}>
            <p className="q-label">
              Question {index + 1}
              <span className="q-bank-id"> · bank #{question.id}</span>
            </p>
            <h2 className="q-text">{question.question}</h2>

            <div className="options" role="group" aria-label="Answer choices">
              {CHOICES.map((choice) => {
                const isSelected = selected === choice
                const isCorrectChoice = choice === question.correct
                let stateClass = ''
                if (phase === 'feedback') {
                  if (isCorrectChoice) stateClass = 'is-correct-option'
                  else if (isSelected) stateClass = 'is-wrong-option'
                  else stateClass = 'is-muted'
                }

                return (
                  <button
                    key={choice}
                    type="button"
                    className={`option ${stateClass}`}
                    onClick={() => chooseOption(choice)}
                    disabled={phase === 'feedback'}
                    aria-pressed={isSelected}
                  >
                    <span className="option-key">{choice}</span>
                    <span className="option-text">{question.options[choice]}</span>
                  </button>
                )
              })}
            </div>

            {phase === 'feedback' && (
              <div className={`feedback ${lastCorrect ? 'is-correct' : 'is-wrong'}`}>
                <div className="feedback-banner">
                  <span className="feedback-badge">{lastCorrect ? 'Correct' : 'Incorrect'}</span>
                  <p className="expected">
                    <span className="expected-label">Correct answer</span>
                    {question.correct}) {question.options[question.correct]}
                  </p>
                </div>
                <div className="fact">
                  <p className="fact-label">Fact</p>
                  <p className="fact-body">{question.fact}</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={goNext} autoFocus>
                  {index >= total - 1 ? 'See results' : 'Next question'}
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
              Review any misses below, then take another pass — questions will shuffle again.
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
                        Your answer: <em>
                          {r.selected}) {q.options[r.selected]}
                        </em>
                      </p>
                      <p className="miss-ans">
                        Correct: {q.correct}) {q.options[q.correct]}
                      </p>
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
