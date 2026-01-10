import { useState } from 'react'
import { ROUTES, navigateTo } from '../routes'

const faqs = [
  {
    question: 'Is this grading tool really free?',
    answer:
      "No. Our AI tool does not provide official certification. Instead, it gives a reliable indication of your card's condition, current value, investment potential, and history.",
  },
  {
    question: 'What are credits used for?',
    answer:
      'Our AI uses advanced image recognition to evaluate centering, corners, edges, and surface. While not official grading, it offers a fast and objective assessment that is highly consistent.',
  },
  {
    question: 'What information will I get about my card?',
    answer:
      'You will receive details about card condition, an estimated market value, an investment outlook, and historical context about the card.',
  },
  {
    question: 'Which trading cards can I analyze with AI?',
    answer: 'Our AI supports TCG cards.',
  },
  {
    question: 'Why use AI instead of waiting for official grading?',
    answer:
      'AI is fast, affordable, realtime, and objective, perfect for collectors and traders who want quick insights before deciding whether to sell, invest, or send cards for official grading.',
  },
]

function FaqPage() {
  const [openSet, setOpenSet] = useState(() => new Set([0]))

  const toggleFaq = (index) => {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="faq-page">
      <header className="faq-nav">
        <div className="faq-logo">FreeGrading</div>
        <nav>
          <button type="button" onClick={() => navigateTo(ROUTES.landing)}>
            Home
          </button>
          <button type="button" onClick={() => navigateTo(ROUTES.gallery)}>
            Gallery
          </button>
          <button type="button" onClick={() => navigateTo(ROUTES.buyCredits)}>
            Buy credits
          </button>
          <button type="button" onClick={() => navigateTo(ROUTES.faq)}>
            FAQ
          </button>
        </nav>
        <button
          type="button"
          className="faq-user"
          onClick={() => navigateTo(ROUTES.login)}
          aria-label="Go to login"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="12"
              cy="8"
              r="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M4 20c1.8-3.2 4.9-5 8-5s6.2 1.8 8 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <main className="faq-main">
        <section className="faq-hero">
          <h1>FAQ's</h1>
          <p>
            Every collector knows the struggle: sending cards away, paying high
            fees, waiting months for results. Our AI changes that. In just
            minutes, you get an indication of condition, market value,
            investment potential, and even card history and more.
          </p>
        </section>

        <section className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openSet.has(index)
            return (
              <article
                key={item.question}
                className={`faq-row ${isOpen ? 'open' : 'closed'}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-plus">{isOpen ? '-' : '+'}</span>
                </button>
                <p className="faq-answer">{item.answer}</p>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="faq-footer">(c) 2026 - All rights reserved</footer>
    </div>
  )
}

export default FaqPage
