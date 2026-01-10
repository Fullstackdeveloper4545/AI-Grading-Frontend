import { useState } from 'react'
import { ROUTES, navigateTo } from '../routes'

const freePrompts = [
  'Quick State + Value',
  'Last price sold 30 days',
  'Quick + Condition',
  'Fake check',
]

const premiumPrompts = [
  { title: 'Realtime Value analyses + stats', credits: '5 Credits' },
  { title: 'Realtime Spider Chart', credits: '10 Credits' },
]

function LandingPage() {
  const [selectedPrompt, setSelectedPrompt] = useState('')

  const getPromptLabel = (prompt) =>
    typeof prompt === 'string' ? prompt : prompt.title

  const selectNextPrompt = (list, direction) => {
    const labels = list.map(getPromptLabel)
    const currentIndex = labels.indexOf(selectedPrompt)
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + labels.length) % labels.length
    setSelectedPrompt(labels[nextIndex])
  }

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-mark" />
          <div>
            <strong>FreeGrading</strong>
            <span>TCG Grading</span>
          </div>
        </div>

        <nav className="landing-links">
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
          className="landing-person-btn"
          onClick={() => navigateTo(ROUTES.login)}
          aria-label="Go to login"
        >
          <span>Account</span>
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

      <main>
        <section className="landing-hero">
          <h1>Free Pokemon &amp; TCG Card Grading Online</h1>
          <p>
            No Fees, no signup! Grade your Pokemon and other trading cards
            without paying expensive fees. Our free online TCG grading tool
            helps you instantly check card condition, rarity, and value. Whether
            you collect Pokemon, Yu-Gi-Oh!, or Magic: The Gathering, you'll
            receive fast and accurate grading results, completely free of
            charge.
          </p>
        </section>

        <section className="landing-prompts">
          <div className="landing-prompt-row">
            <div className="landing-prompt-label">Free Prompts</div>
            <button
              type="button"
              className="landing-arrow"
              aria-label="Previous free prompt"
              onClick={() => selectNextPrompt(freePrompts, -1)}
            >
              &lt;
            </button>
            <div className="landing-prompt-grid">
              {freePrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`landing-prompt-card ${
                    selectedPrompt === item ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedPrompt(item)}
                >
                  <strong>{item}</strong>
                  <span>(Free)</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="landing-arrow"
              aria-label="Next free prompt"
              onClick={() => selectNextPrompt(freePrompts, 1)}
            >
              &gt;
            </button>
          </div>

          <div className="landing-prompt-row">
            <div className="landing-prompt-label">Premium Prompts</div>
            <button
              type="button"
              className="landing-arrow"
              aria-label="Previous premium prompt"
              onClick={() => selectNextPrompt(premiumPrompts, -1)}
            >
              &lt;
            </button>
            <div className="landing-prompt-grid compact">
              {premiumPrompts.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className={`landing-prompt-card ${
                    selectedPrompt === item.title ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedPrompt(item.title)}
                >
                  <strong>{item.title}</strong>
                  <span>({item.credits})</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="landing-arrow"
              aria-label="Next premium prompt"
              onClick={() => selectNextPrompt(premiumPrompts, 1)}
            >
              &gt;
            </button>
          </div>
        </section>

        <section className="landing-upload">
          <div className="landing-upload-field">
            <label htmlFor="front-image">Front Image</label>
            <input id="front-image" type="file" />
          </div>
          <div className="landing-upload-field">
            <label htmlFor="back-image">Back Image</label>
            <input id="back-image" type="file" />
          </div>
        </section>

        <button
          type="button"
          className="landing-start-btn"
          onClick={() => navigateTo(ROUTES.scan)}
        >
          Start Grading
        </button>

        <section className="landing-results">
          <div className="landing-results-header">GRADING RESULTS:</div>
          <div className="landing-results-body">
            Prompt results will appear here...
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2025 - All rights reserved</p>
      </footer>
    </div>
  )
}

export default LandingPage
