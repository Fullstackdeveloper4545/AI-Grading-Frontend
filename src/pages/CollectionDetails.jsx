import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../api/auth'

const fallbackImages = [
  '/cards/card-1.svg',
  '/cards/card-2.svg',
  '/cards/card-3.svg',
  '/cards/card-4.svg',
]

function CollectionDetailsPage() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [images, setImages] = useState({ front: '', back: '' })
  const [activeSide, setActiveSide] = useState('front')

  const listingId = useMemo(() => {
    const query = window.location.hash.split('?')[1] || ''
    const params = new URLSearchParams(query)
    return Number(params.get('id') || '')
  }, [])

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        setError('Listing not found.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/listings?limit=100`)
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          setError(data?.detail || 'Failed to load listing.')
          return
        }
        const found = (data?.items || []).find(
          (item) => Number(item.id) === Number(listingId)
        )
        if (!found) {
          setError('Listing not found.')
          return
        }
        setListing(found)
      } catch (err) {
        setError('Failed to load listing.')
      } finally {
        setLoading(false)
      }
    }

    loadListing()
  }, [listingId])

  useEffect(() => {
    const loadImages = async () => {
      if (!listingId) {
        return
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/listings/${listingId}/image-details`
        )
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          return
        }
        const front = data?.front_image?.image_url
        const back = data?.back_image?.image_url
        setImages({
          front: front ? `${API_BASE_URL}/${front}` : '',
          back: back ? `${API_BASE_URL}/${back}` : '',
        })
      } catch (err) {
        setImages({ front: '', back: '' })
      }
    }

    loadImages()
  }, [listingId])

  const frontImage =
    images.front || listing?.front_image_url
      ? images.front || `${API_BASE_URL}/${listing.front_image_url}`
      : fallbackImages[0]
  const backImage = images.back || fallbackImages[1]

  const mainImage = activeSide === 'back' ? backImage : frontImage
  const sideImage = activeSide === 'back' ? frontImage : backImage

  return (
    <div className="details-page">
      <header className="details-hero">
        <div className="details-hero-bar">
          <button
            type="button"
            className="details-back-btn"
            onClick={() => {
              window.location.hash = '#/collection'
            }}
          >
            Back
          </button>
        </div>
        <div className="details-hero-content">
          <button
            type="button"
            className={`details-main-card ${
              activeSide === 'front' ? 'active' : ''
            }`}
            onClick={() => setActiveSide('front')}
          >
            <div className="details-main-header">
              <span>{listing?.title || 'Card Scan Upload'}</span>
              <strong>{listing?.psa_grade || 'N/A'}</strong>
            </div>
            <div className="details-main-image">
              {loading ? (
                <div className="details-empty">Loading...</div>
              ) : error ? (
                <div className="details-empty">{error}</div>
              ) : (
                <img src={mainImage} alt="Main card" />
              )}
            </div>
            <div className="details-main-footer">
              <span>{activeSide === 'back' ? 'Back' : 'Front'}</span>
              <strong>GEM MINT</strong>
            </div>
          </button>

          <button
            type="button"
            className={`details-side-card ${
              activeSide === 'back' ? 'active' : ''
            }`}
            onClick={() => setActiveSide('back')}
          >
            <div className="details-side-header">
              <span>{activeSide === 'back' ? 'Front' : 'Back'}</span>
              <strong>{listing?.psa_grade || 'N/A'}</strong>
            </div>
            <div className="details-side-image">
              {loading ? (
                <div className="details-empty">Loading...</div>
              ) : error ? (
                <div className="details-empty">{error}</div>
              ) : (
                <img src={sideImage} alt="Side card" />
              )}
            </div>
          </button>
        </div>
      </header>

      <section className="details-body">
        <aside className="details-left">
          <div className="details-gallery">
            <h4>Photos (2)</h4>
            <div className="details-thumbs">
              <button
                type="button"
                className={activeSide === 'front' ? 'active' : ''}
                onClick={() => setActiveSide('front')}
              >
                <img src={frontImage} alt="Front thumbnail" />
              </button>
              <button
                type="button"
                className={activeSide === 'back' ? 'active' : ''}
                onClick={() => setActiveSide('back')}
              >
                <img src={backImage} alt="Back thumbnail" />
              </button>
            </div>
            <p>Click any photo to change the main view.</p>
          </div>

          <div className="details-card-info">
            <h3>{listing?.title || 'Metagross GX - Sun & Moon'}</h3>
            <p>{listing?.set_name || 'Sun & Moon'}</p>
            <div className="details-price">
              <span>Asking Price</span>
              <strong>
                {typeof listing?.price === 'number'
                  ? `$${listing.price.toFixed(2)}`
                  : '$0.00'}
              </strong>
            </div>
            <button type="button" className="details-action">
              Watch
            </button>
            <button type="button" className="details-action secondary">
              Offer Trade
            </button>
          </div>

          <div className="details-seller">
            <h4>Seller</h4>
            <div className="details-seller-row">
              <span className="details-avatar">L</span>
              <div>
                <strong>Legendary</strong>
                <span>Card Seller</span>
              </div>
            </div>
            <div className="details-seller-actions">
              <button type="button">Profile</button>
              <button type="button">Message</button>
            </div>
          </div>
        </aside>

        <div className="details-right">
          <div className="details-info-card">
            <div className="details-info-header">
              <h3>Card Information</h3>
              <button type="button">View Full Grading Details</button>
            </div>
            <div className="details-info-grid">
              <div>
                <span>Card Name</span>
                <strong>{listing?.title || 'Metagross GX'}</strong>
              </div>
              <div>
                <span>Set</span>
                <strong>{listing?.set_name || 'Sun & Moon'}</strong>
              </div>
              <div>
                <span>Number</span>
                <strong>#157/145</strong>
              </div>
            </div>
            <p>
              PSA - I don&apos;t have PayPal so Venmo and Apple Pay work fine
              and cash is always accepted
            </p>
          </div>

          <div className="details-grade-card">
            <div className="details-grade-header">
              <h3>Grade Breakdown - {listing?.title || 'Metagross GX'}</h3>
              <span className="details-grade-score">
                {listing?.psa_grade || '9.3'}
              </span>
            </div>
            {[
              { label: 'Corners', value: '9.1' },
              { label: 'Edges', value: '9.3' },
              { label: 'Surface', value: '9.4' },
              { label: 'Centering', value: '9.4' },
              { label: 'Holographic', value: '9.5' },
            ].map((row) => (
              <div key={row.label} className="details-grade-row">
                <span>{row.label}</span>
                <div className="details-grade-bar">
                  <span style={{ width: `${Number(row.value) * 10}%` }} />
                </div>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>

          <div className="details-comments">
            <h3>Comments & Questions (0)</h3>
            <p>No comments yet.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CollectionDetailsPage
