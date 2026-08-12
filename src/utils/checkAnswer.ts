import type { Question } from '../data/questions'

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‘’‛‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/→/g, ' ')
    .replace(/[^a-z0-9%~.\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesPhrase(haystack: string, needle: string): boolean {
  const n = normalize(needle)
  if (!n) return false

  // Short tokens (1–2 chars) need word-boundary style matching
  if (n.length <= 2) {
    const re = new RegExp(`(?:^|\\s)${escapeRegExp(n)}(?:\\s|$)`)
    return re.test(haystack)
  }

  return haystack.includes(n)
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function checkAnswer(question: Question, userAnswer: string): boolean {
  const typed = normalize(userAnswer)
  if (!typed) return false

  const matched = question.accepted.filter((a) => includesPhrase(typed, a))
  const needed = question.minMatches ?? 1
  return matched.length >= needed
}
