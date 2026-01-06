import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../api/auth'

const fallbackImages = [
  '/cards/card-1.svg',
  '/cards/card-2.svg',
  '/cards/card-3.svg',
  '/cards/card-4.svg',
]

function CollectionPage() {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [cardType, setCardType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [idFilter, setIdFilter] = useState('')
  const [lookupError, setLookupError] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [imagesById, setImagesById] = useState({})

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const params = new URLSearchParams()
        if (cardType) {
          params.append('card_type', cardType)
        }
        const gradeValue = selectedGrade ? Number(selectedGrade) : null
        if (gradeValue && Number.isInteger(gradeValue)) {
          params.append('psa_grade', String(gradeValue))
        }
        if (minPrice) {
          params.append('min_price', minPrice)
        }
        if (maxPrice) {
          params.append('max_price', maxPrice)
        }
        params.append('limit', '50')

        const response = await fetch(
          `${API_BASE_URL}/listings?${params.toString()}`
        )
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          setLoadError(data?.detail || 'Failed to load listings.')
          setListings([])
          return
        }
        setListings(data?.items || [])
      } catch (error) {
        setLoadError('Failed to load listings.')
        setListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [cardType, minPrice, maxPrice, selectedGrade])

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesId = !idFilter || item.id === Number(idFilter)
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.set_name || '').toLowerCase().includes(search.toLowerCase())
      const gradeValue = selectedGrade ? Number(selectedGrade) : null
      const matchesGrade =
        !gradeValue || Number(item.psa_grade) === Number(gradeValue)
      return matchesId && matchesSearch && matchesGrade
    })
  }, [listings, search, selectedGrade, idFilter])


  const handleIdSearch = async () => {
    setLookupError('')
    if (!idFilter) {
      return
    }
    const listingId = Number(idFilter)
    if (!listingId || Number.isNaN(listingId)) {
      setLookupError('Enter a valid listing ID.')
      return
    }
    setLookupLoading(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/listings/${listingId}/images`
      )
      const data = await response.json().catch(() => [])
      if (!response.ok) {
        setLookupError(data?.detail || 'Listing not found.')
        return
      }
      const front = data.find((img) => img.image_type === 'front')?.image_url
      const back = data.find((img) => img.image_type === 'back')?.image_url
      setImagesById((prev) => ({
        ...prev,
        [listingId]: {
          front: front ? `${API_BASE_URL}/${front}` : '',
          back: back ? `${API_BASE_URL}/${back}` : '',
        },
      }))
    } catch (error) {
      setLookupError('Listing not found.')
    } finally {
      setLookupLoading(false)
    }
  }

  return (
    <div className="collection-page">
      <section className="collection-toolbar">
        <div className="collection-search">
          <span className="collection-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M16.2 16.2L20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search cards by name, set, or number..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          value={cardType}
          onChange={(event) => setCardType(event.target.value)}
        >
          <option value="">All Card Types</option>
          <option value="pokemon">Pokemon</option>
          <option value="sports">Sports</option>
        </select>
        <select>
          <option>Recently Listed</option>
        </select>
        <button
          type="button"
          className="collection-filter-btn"
          onClick={() => setFilterOpen((prev) => !prev)}
        >
          Filters
        </button>
      </section>

      <section className="collection-meta">
        <span>{filteredListings.length} listings found</span>
        <div className="collection-view-toggle">
          <button
            type="button"
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="7" height="7" rx="1" />
              <rect x="13" y="4" width="7" height="7" rx="1" />
              <rect x="4" y="13" width="7" height="7" rx="1" />
              <rect x="13" y="13" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="6" width="16" height="2" rx="1" />
              <rect x="4" y="11" width="16" height="2" rx="1" />
              <rect x="4" y="16" width="16" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </section>

      <section className={`collection-body ${filterOpen ? 'with-filters' : ''}`}>
        {filterOpen ? (
          <aside className="collection-filters">
            <h3>Filters</h3>
            <div className="collection-filter-group">
              <label>Listing ID</label>
              <div className="collection-id-search">
                <input
                  type="text"
                  placeholder="Enter ID"
                  value={idFilter}
                  onChange={(event) => setIdFilter(event.target.value)}
                />
                <button
                  type="button"
                  onClick={handleIdSearch}
                  disabled={lookupLoading}
                >
                  {lookupLoading ? '...' : 'Find'}
                </button>
              </div>
              {lookupError ? (
                <span className="collection-id-error">{lookupError}</span>
              ) : null}
            </div>
            <div className="collection-filter-group">
              <label>Price Range</label>
              <div className="collection-range">
                <input
                  type="text"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>
            </div>
            <div className="collection-filter-group">
              <label>Grade</label>
              {['10', '9.5', '9', '8.5', '8'].map((grade) => (
                <label key={grade} className="collection-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGrade === grade}
                    onChange={() =>
                      setSelectedGrade((prev) => (prev === grade ? '' : grade))
                    }
                  />
                  Grade {grade}
                </label>
              ))}
            </div>
            <button
              type="button"
              className="collection-clear"
              onClick={() => {
                setSelectedGrade('')
                setMinPrice('')
                setMaxPrice('')
                setIdFilter('')
                setLookupError('')
              }}
            >
              Clear All Filters
            </button>
          </aside>
        ) : null}

        <div className={`collection-list ${viewMode}`}>
          {isLoading ? (
            <div className="collection-status">Loading listings...</div>
          ) : null}
          {!isLoading && loadError ? (
            <div className="collection-status error">{loadError}</div>
          ) : null}
          {!isLoading && !loadError && filteredListings.length === 0 ? (
            <div className="collection-status">No listings found.</div>
          ) : null}
          {filteredListings.map((item, index) => (
            <article key={item.id} className="collection-card">
              <div className="collection-image">
                <img
                  src={
                    imagesById[item.id]?.front
                      ? imagesById[item.id].front
                      : item.front_image_url
                      ? `${API_BASE_URL}/${item.front_image_url}`
                      : fallbackImages[index % fallbackImages.length]
                  }
                  alt={item.title}
                />
                <span className="collection-grade">
                  Grade {item.psa_grade || 'N/A'}
                </span>
              </div>
              <div className="collection-info">
                <h4>{item.title}</h4>
                <p>{item.set_name || 'N/A'}</p>
                <strong>
                  {typeof item.price === 'number'
                    ? `$${item.price.toFixed(2)}`
                    : 'N/A'}
                </strong>
                <div className="collection-owner">
                  <span className="collection-avatar">L</span>
                  Listing
                </div>
                <div className="collection-stats">
                  <span>Views 0</span>
                  <span>Watchers 0</span>
                </div>
                <button
                  type="button"
                  className="collection-details-btn"
                  onClick={() => {
                    window.location.hash = `#/collection-details?id=${item.id}`
                  }}
                >
                  View Full Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}

export default CollectionPage
