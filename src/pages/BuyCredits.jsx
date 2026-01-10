import { ROUTES, navigateTo } from '../routes'

const creditPacks = [
  { title: '+1.000 Credits', price: '€ 10,00' },
  { title: '+5.000 Credits', price: '€ 50,00' },
  { title: '+10.000 Credits', price: '€ 100,00' },
]

function BuyCreditsPage() {
  return (
    <div className="buy-credits-page">
      <header className="buy-credits-nav">
        <div className="buy-credits-logo">FreeGrading</div>
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
          className="buy-credits-user"
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

      <main className="buy-credits-main">
        <section className="buy-credits-hero">
          <p>
            You only need to register below and continue directly to the
            payment.
          </p>
        </section>

        <section className="buy-credits-section" style={{ marginTop: '50px' }}>
          <h1>Credits</h1>
          <p>Choose the credits amount you want to add to your wallet</p>
          <div className="buy-credits-grid">
            {creditPacks.map((pack) => (
              <button
                key={pack.title}
                type="button"
                className="buy-credits-card"
                onClick={() => navigateTo(ROUTES.register)}
              >          
                <span>{pack.title}</span>
                <strong>{pack.price}</strong>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="buy-credits-footer">
        © 2026 - All rights reserved
      </footer>
    </div>
  )
}

export default BuyCreditsPage
