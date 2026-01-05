import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api/users'

const menuItems = [
  'Dashboard',
  'Scan card',
  'Collection',
  'Raw cards (filter)',
  'Graded cards (filter)',
  'Investment',
  'Market places',
]

const settingsItems = [
  'Connections (marketplaces)',
  'Subscriptions',
  'Invoices',
]

function DashboardPage() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [rawOpen, setRawOpen] = useState(true)
  const [gradedOpen, setGradedOpen] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [userError, setUserError] = useState('')

  const renderFilterBadge = (label, isOpen, onToggle) => (
    <button type="button" className="dash-filter-pill" onClick={onToggle}>
      <span className="dash-filter-icon">{isOpen ? '-' : '+'}</span>
      {label}
    </button>
  )

  useEffect(() => {
    let isMounted = true
    const loadUser = async () => {
      const result = await fetchCurrentUser()
      if (!isMounted) {
        return
      }
      if (!result.ok) {
        setUserError(result.error || 'Unable to load profile.')
        return
      }
      setUserProfile(result.data)
    }
    loadUser()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span>USER MENU</span>
          <small>{userError || userProfile?.full_name || '(logged in)'}</small>
        </div>

        <nav className="dash-menu">
          {menuItems.map((item) => {
            const isFilter = item.includes('(filter)')
            const isRaw = item.startsWith('Raw')
            const isGraded = item.startsWith('Graded')
            const isActive = activeItem === item

            return (
              <button
                key={item}
                type="button"
                className={`dash-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveItem(item)}
              >
                {isFilter ? (
                  <span className="dash-filter-row">
                    {isRaw &&
                      renderFilterBadge('Raw cards', rawOpen, () =>
                        setRawOpen((prev) => !prev)
                      )}
                    {isGraded &&
                      renderFilterBadge('Graded cards', gradedOpen, () =>
                        setGradedOpen((prev) => !prev)
                      )}
                  </span>
                ) : (
                  item
                )}
              </button>
            )
          })}
        </nav>

        <div className="dash-section-title">SETTINGS</div>

        <nav className="dash-menu">
          <button
            type="button"
            className="dash-item"
            onClick={() => {
              window.location.hash = '#/profile'
            }}
          >
            Profile
          </button>
          {settingsItems.map((item) => (
            <button
              key={item}
              type="button"
              className={`dash-item ${activeItem === item ? 'active' : ''}`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dash-content">
        <header className="dash-header">
          <div>
            <p className="dash-kicker">Overview</p>
            <h1>{activeItem}</h1>
            <p className="dash-subtitle">
              Track grading tasks, collection signals, and marketplace activity.
            </p>
          </div>
          <button type="button" className="dash-primary-btn">
            New Scan
          </button>
        </header>

        <section className="dash-stats">
          <div>
            <h3>Cards in Queue</h3>
            <strong>128</strong>
          </div>
          <div>
            <h3>Active Listings</h3>
            <strong>42</strong>
          </div>
          <div>
            <h3>ROI Alerts</h3>
            <strong>9</strong>
          </div>
        </section>

        <section className="dash-grid">
          <article className="dash-card">
            <h2>Dashboard</h2>
            <p>Summary of your grading pipeline and collection status.</p>
            <div className="dash-row">
              <span>Cards in queue</span>
              <strong>12</strong>
            </div>
            <div className="dash-row">
              <span>Awaiting grading</span>
              <strong>7</strong>
            </div>
            <div className="dash-row">
              <span>Marketplace listings</span>
              <strong>4</strong>
            </div>
          </article>

          <article className="dash-card">
            <h2>Quick Filters</h2>
            <p>Toggle filters to manage raw and graded cards.</p>
            <div className="dash-toggle-row">
              <span>Raw cards</span>
              <button
                type="button"
                className={`dash-toggle ${rawOpen ? 'on' : ''}`}
                onClick={() => setRawOpen((prev) => !prev)}
              >
                {rawOpen ? 'On' : 'Off'}
              </button>
            </div>
            <div className="dash-toggle-row">
              <span>Graded cards</span>
              <button
                type="button"
                className={`dash-toggle ${gradedOpen ? 'on' : ''}`}
                onClick={() => setGradedOpen((prev) => !prev)}
              >
                {gradedOpen ? 'On' : 'Off'}
              </button>
            </div>
          </article>

          <article className="dash-card">
            <h2>Market Places</h2>
            <p>Connect to Ebay, TCGplayer, and more.</p>
            <ul className="dash-list">
              <li>Ebay - Connected</li>
              <li>TCGplayer - Pending</li>
              <li>Cardmarket - Not Connected</li>
            </ul>
            <button type="button" className="dash-outline-btn">
              Manage Connections
            </button>
          </article>
        </section>

        <section className="dash-wide">
          <div>
            <h2>Collection Overview</h2>
            <p>
              Track grading ROI, see which cards to grade next, and monitor
              market signals.
            </p>
          </div>
          <div className="dash-pill-row">
            <span className="dash-pill">Investment picks</span>
            <span className="dash-pill">Top movers</span>
            <span className="dash-pill">Needed scans</span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
