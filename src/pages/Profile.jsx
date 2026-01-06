import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../api/auth'
import {
  deleteMyImage,
  fetchCurrentUser,
  fetchMyImages,
  setProfileImage,
  uploadMyImage,
} from '../api/users'

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

function ProfilePage() {
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
  const [userImages, setUserImages] = useState({ profile: '', gallery: [] })
  const [imagesError, setImagesError] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [profileImageId, setProfileImageId] = useState(null)
  const [isDeletingImage, setIsDeletingImage] = useState(false)

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
  const profileAvatarUrl = profileForm.avatar || userImages.profile

  const handleProfileChange = (field, value) => {
    setProfileMessage('')
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setProfileMessage('')
    setImagesError('')
    setIsUploadingImage(true)
    const result = await uploadMyImage(file, true)
    if (!result.ok) {
      setImagesError(result.error || 'Unable to upload image.')
      setIsUploadingImage(false)
      return
    }
    const imageUrl = result.data?.image_url
      ? `${API_BASE_URL}/${result.data.image_url}`
      : ''
    setProfileForm((prev) => ({ ...prev, avatar: imageUrl }))
    setUserImages((prev) => ({ ...prev, profile: imageUrl }))
    setProfileImageId(result.data?.id || null)
    setProfileMessage('Profile photo updated.')
    setIsUploadingImage(false)
  }

  const handleSetProfileImage = async (imageId) => {
    setImagesError('')
    const result = await setProfileImage(imageId)
    if (!result.ok) {
      setImagesError(result.error || 'Unable to update profile image.')
      return
    }
    const imageUrl = result.data?.image_url
      ? `${API_BASE_URL}/${result.data.image_url}`
      : ''
    setProfileForm((prev) => ({ ...prev, avatar: imageUrl }))
    setUserImages((prev) => ({ ...prev, profile: imageUrl }))
    setProfileImageId(imageId)
    setProfileMessage('Profile photo updated.')
  }

  const handleDeleteImage = async (imageId) => {
    setImagesError('')
    setIsDeletingImage(true)
    const result = await deleteMyImage(imageId)
    if (!result.ok) {
      setImagesError(result.error || 'Unable to delete image.')
      setIsDeletingImage(false)
      return
    }
    setUserImages((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img.id !== imageId),
    }))
    if (profileImageId === imageId) {
      setProfileImageId(null)
      setProfileForm((prev) => ({ ...prev, avatar: '' }))
      setUserImages((prev) => ({ ...prev, profile: '' }))
    }
    setProfileMessage('Image deleted.')
    setIsDeletingImage(false)
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
    let isMounted = true
    const loadImages = async () => {
      const result = await fetchMyImages()
      if (!isMounted) {
        return
      }
      if (!result.ok) {
        setImagesError(result.error || 'Unable to load images.')
        return
      }
      const profileImageUrl = result.data?.profile_image?.image_url
      const galleryImages = result.data?.gallery_images || []
      setUserImages({
        profile: profileImageUrl ? `${API_BASE_URL}/${profileImageUrl}` : '',
        gallery: galleryImages.map((img) => ({
          id: img.id,
          url: `${API_BASE_URL}/${img.image_url}`,
        })),
      })
      setProfileImageId(result.data?.profile_image?.id || null)
    }
    loadImages()
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

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span>USER MENU</span>
          <small>{userError || profileName}</small>
        </div>

        <nav className="dash-menu">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              className="dash-item"
              onClick={() => {
                window.location.hash = '#/dashboard'
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="dash-section-title">SETTINGS</div>

        <nav className="dash-menu">
          <button type="button" className="dash-item active">
            Profile
          </button>
          {settingsItems.map((item) => (
            <button
              key={item}
              type="button"
              className="dash-item"
              onClick={() => {
                window.location.hash = '#/dashboard'
              }}
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
            <h1>Profile</h1>
            <p className="dash-subtitle">
              Manage your account details and preferences.
            </p>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-header">
            <div className="profile-identity">
              {profileAvatarUrl ? (
                <img
                  src={profileAvatarUrl}
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
                  disabled={isUploadingImage}
                />
                {isUploadingImage ? 'Uploading...' : 'Upload photo'}
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

          <div className="profile-gallery">
            <div className="profile-gallery-header">
              <h3>My Images</h3>
              {imagesError ? (
                <span className="profile-gallery-error">{imagesError}</span>
              ) : null}
            </div>
            <div className="profile-gallery-grid">
              {userImages.profile ? (
                <div className="profile-gallery-item">
                  <img src={userImages.profile} alt="Profile" />
                  <span>Profile</span>
                </div>
              ) : null}
              {userImages.gallery.map((img) => (
                <div key={img.id} className="profile-gallery-item">
                  <img src={img.url} alt="Gallery" />
                  <span>Gallery</span>
                  {profileImageId === img.id ? (
                    <span className="profile-gallery-badge">Profile</span>
                  ) : (
                    <div className="profile-gallery-actions">
                      <button
                        type="button"
                        className="profile-gallery-action"
                        onClick={() => handleSetProfileImage(img.id)}
                        disabled={isDeletingImage}
                      >
                        Set as profile
                      </button>
                      <button
                        type="button"
                        className="profile-gallery-delete"
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={isDeletingImage}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {!userImages.profile &&
              userImages.gallery.length === 0 &&
              !imagesError ? (
                <div className="profile-gallery-empty">
                  No images uploaded yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProfilePage
