import { useEffect, useState } from 'react'
import { fetchCurrentUser } from '../api/users'
import DashboardSidebar from '../components/DashboardSidebar'
import {
  dashboardMenuItems,
  dashboardSettingsItems,
} from '../components/dashboardMenu'
import { ROUTES, navigateTo } from '../routes'

function DashboardPage() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [rawOpen, setRawOpen] = useState(true)
  const [gradedOpen, setGradedOpen] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [userError, setUserError] = useState('')
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
  })
  const [profileInitialized, setProfileInitialized] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  const profileStorageKey = 'profile_details'

  const profileName =
    profileForm.full_name || userProfile?.full_name || 'Your Name'
  const profileEmail =
    profileForm.email || userProfile?.email || 'you@example.com'
  const profileInitials = profileName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleProfileChange = (field, value) => {
    setProfileMessage('')
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProfileMessage('')
      setProfileForm((prev) => ({ ...prev, avatar: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    localStorage.setItem(profileStorageKey, JSON.stringify(profileForm))
    setProfileMessage('Profile saved.')
    setIsEditingProfile(false)
  }

  const handleCancelProfile = () => {
    const saved = localStorage.getItem(profileStorageKey)
    if (saved) {
      try {
        setProfileForm(JSON.parse(saved))
      } catch {
        setProfileForm((prev) => ({ ...prev }))
      }
    } else if (userProfile) {
      setProfileForm((prev) => ({
        ...prev,
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
      }))
    }
    setIsEditingProfile(false)
  }

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

  useEffect(() => {
    if (profileInitialized) {
      return
    }
    const saved = localStorage.getItem(profileStorageKey)
    if (saved) {
      try {
        setProfileForm(JSON.parse(saved))
        setProfileInitialized(true)
        return
      } catch {
        // ignore invalid stored data
      }
    }
    if (userProfile) {
      setProfileForm((prev) => ({
        ...prev,
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
      }))
      setProfileInitialized(true)
    }
  }, [profileInitialized, profileStorageKey, userProfile])

  const headerSubtitle =
    activeItem === 'Profile'
      ? 'Manage your account details and preferences.'
      : 'Track grading tasks, collection signals, and marketplace activity.'

  const filters = {
    raw: { label: 'Raw cards', isOpen: rawOpen },
    graded: { label: 'Graded cards', isOpen: gradedOpen },
  }

  const handleToggleFilter = (filterKey) => {
    if (filterKey === 'raw') {
      setRawOpen((prev) => !prev)
    }
    if (filterKey === 'graded') {
      setGradedOpen((prev) => !prev)
    }
  }

  const handleSelectItem = (item) => {
    if (item.route) {
      navigateTo(item.route)
      return
    }
    setActiveItem(item.label)
  }

  return (
    <div className="dash-page">
      <DashboardSidebar
        userName={profileName}
        userError={userError}
        menuItems={dashboardMenuItems}
        settingsItems={dashboardSettingsItems}
        activeItem={activeItem}
        filters={filters}
        onToggleFilter={handleToggleFilter}
        onSelectItem={handleSelectItem}
      />

      <main className="dash-content">
        <header className="dash-header">
          <div>
            <p className="dash-kicker">Overview</p>
            <h1>{activeItem}</h1>
            <p className="dash-subtitle">
              {headerSubtitle}
            </p>
          </div>
          {activeItem !== 'Profile' && (
            <button
              type="button"
              className="dash-primary-btn"
              onClick={() => {
                navigateTo(ROUTES.scan)
              }}
            >
              New Scan
            </button>
          )}
        </header>

        {activeItem === 'Profile' ? (
          <section className="profile-card">
            <div className="profile-header">
              <div className="profile-identity">
                {profileForm.avatar ? (
                  <img
                    src={profileForm.avatar}
                    alt="Profile"
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar">{profileInitials}</div>
                )}
                <div>
                  <h2>{profileName}</h2>
                  <p>{profileEmail}</p>
                </div>
              </div>
              <div className="profile-actions">
                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      className="dash-primary-btn"
                      onClick={handleSaveProfile}
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="dash-outline-btn"
                      onClick={handleCancelProfile}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="dash-primary-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </div>

            {isEditingProfile && (
              <div className="profile-upload-row">
                <label className="profile-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  Upload photo
                </label>
                {profileForm.avatar && (
                  <button
                    type="button"
                    className="dash-outline-btn"
                    onClick={() => handleProfileChange('avatar', '')}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {profileMessage && (
              <div className="profile-message">{profileMessage}</div>
            )}

            <div className="profile-grid">
              <div className="profile-field">
                <span>Full name</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(event) =>
                      handleProfileChange('full_name', event.target.value)
                    }
                    placeholder="Your full name"
                  />
                ) : (
                  <p>{profileForm.full_name || 'Not set'}</p>
                )}
              </div>

              <div className="profile-field">
                <span>Email</span>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) =>
                      handleProfileChange('email', event.target.value)
                    }
                    placeholder="you@example.com"
                  />
                ) : (
                  <p>{profileForm.email || 'Not set'}</p>
                )}
              </div>

              <div className="profile-field">
                <span>Phone</span>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(event) =>
                      handleProfileChange('phone', event.target.value)
                    }
                    placeholder="(555) 555-5555"
                  />
                ) : (
                  <p>{profileForm.phone || 'Not set'}</p>
                )}
              </div>

              <div className="profile-field">
                <span>Location</span>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(event) =>
                      handleProfileChange('location', event.target.value)
                    }
                    placeholder="City, Country"
                  />
                ) : (
                  <p>{profileForm.location || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="profile-bio">
              <h3>About</h3>
              {isEditingProfile ? (
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(event) =>
                    handleProfileChange('bio', event.target.value)
                  }
                  placeholder="Share a short bio about yourself."
                />
              ) : (
                <p>
                  {profileForm.bio ||
                    'Add a short bio to personalize your profile.'}
                </p>
              )}
            </div>
          </section>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
