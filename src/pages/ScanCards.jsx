import { useEffect, useState } from 'react'
import { API_BASE_URL, refreshAuthTokens } from '../api/auth'

function ScanCardsPage() {
  const [frontName, setFrontName] = useState('')
  const [backName, setBackName] = useState('')
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)
  const [frontPreview, setFrontPreview] = useState('')
  const [backPreview, setBackPreview] = useState('')
  const [listingId, setListingId] = useState(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!frontFile) {
      setFrontPreview('')
      return
    }
    const url = URL.createObjectURL(frontFile)
    setFrontPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [frontFile])

  useEffect(() => {
    if (!backFile) {
      setBackPreview('')
      return
    }
    const url = URL.createObjectURL(backFile)
    setBackPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [backFile])

  const uploadImages = async () => {
    setUploadError('')
    setUploadMessage('')

    if (!frontFile && !backFile) {
      setUploadError('Please upload the front or back image first.')
      return
    }

    let accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      setUploadError('Missing access token. Please sign in again.')
      return
    }

    const formData = new FormData()
    if (listingId) {
      formData.append('listing_id', String(listingId))
    }
    formData.append('title', 'Card Scan Upload')
    formData.append('card_type', 'pokemon')
    if (frontFile) {
      formData.append('front_image', frontFile)
    }
    if (backFile) {
      formData.append('back_image', backFile)
    }

    const attemptUpload = async () =>
      fetch(`${API_BASE_URL}/listings/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })

    setIsUploading(true)
    try {
      let response = await attemptUpload()
      if (response.status === 401) {
        const refreshResult = await refreshAuthTokens()
        if (!refreshResult.ok) {
          setUploadError(refreshResult.error || 'Session expired.')
          return
        }
        accessToken = localStorage.getItem('access_token')
        response = await attemptUpload()
      }

      const data = await response.json().catch(() => [])
      if (!response.ok) {
        setUploadError(data?.detail || 'Upload failed. Please try again.')
        return
      }

      const createdListingId = data?.[0]?.listing_id
      if (createdListingId) {
        setListingId(createdListingId)
      }
      setUploadMessage('Images uploaded successfully.')
    } catch (error) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="scan-page">
      <header className="scan-hero">
        <span className="scan-pill">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2l1.6 4.2L18 8l-4.4 1.8L12 14l-1.6-4.2L6 8l4.4-1.8L12 2zm7 2.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"
              fill="currentColor"
            />
          </svg>
          AI-Powered Card Grading
        </span>
        <h1>
          Grade Your <span>Pokémon</span> Cards
        </h1>
        <p>
          Upload your card&apos;s front and back for instant AI analysis. Get
          professional-grade assessments in seconds.
        </p>
      </header>

      <section className="scan-upload">
        <div className="scan-upload-card">
          <div className="scan-upload-grid">
            <div className="scan-drop">
              <h2>Card Front</h2>
              <label
                className={`scan-drop-box ${frontPreview ? 'has-preview' : ''}`}
                htmlFor="scan-front"
              >
                {frontPreview ? (
                  <img
                    className="scan-drop-preview"
                    src={frontPreview}
                    alt="Card front preview"
                  />
                ) : (
                  <>
                    <div className="scan-drop-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 18.5h14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p>Drop image here</p>
                    <span className="scan-browse">or click to browse</span>
                  </>
                )}
                <input
                  id="scan-front"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setFrontFile(file || null)
                    setFrontName(file ? file.name : '')
                  }}
                />
              </label>
              <small>
                {frontName || 'Upload a clear photo of the card front'}
              </small>
            </div>

            <div className="scan-drop">
              <h2>Card Back</h2>
              <label
                className={`scan-drop-box ${backPreview ? 'has-preview' : ''}`}
                htmlFor="scan-back"
              >
                {backPreview ? (
                  <img
                    className="scan-drop-preview"
                    src={backPreview}
                    alt="Card back preview"
                  />
                ) : (
                  <>
                    <div className="scan-drop-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 18.5h14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p>Drop image here</p>
                    <span className="scan-browse">or click to browse</span>
                  </>
                )}
                <input
                  id="scan-back"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setBackFile(file || null)
                    setBackName(file ? file.name : '')
                  }}
                />
              </label>
              <small>
                {backName || 'Upload the back of the card for verification'}
              </small>
            </div>
          </div>

          <button
            type="button"
            className="scan-primary-btn"
            onClick={uploadImages}
            disabled={isUploading}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                fill="currentColor"
              />
            </svg>
            {isUploading ? 'Uploading...' : 'Start Grading'}
          </button>
          <small className="scan-upload-note">
            {uploadError || uploadMessage || 'Upload both sides to enable grading'}
          </small>
        </div>
      </section>

      <section className="scan-features">
        <article>
          <span className="scan-feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3>Instant Results</h3>
          <p>Get your card grade in under 30 seconds</p>
        </article>
        <article>
          <span className="scan-feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l8 4v6c0 5-3.4 9.7-8 10-4.6-.3-8-5-8-10V6l8-4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3>Accurate Analysis</h3>
          <p>AI trained on thousands of graded cards</p>
        </article>
        <article>
          <span className="scan-feature-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 4l1.6 4L11 9.6 6.6 11 5 15l-1.6-4L0 9.6 3.4 8 5 4zm14 0l1.4 3.3L24 8.6l-3.6 1.4L19 13l-1.4-3.3L14 8.6l3.6-1.3L19 4zM12 11l1.8 4.5 4.2 1.6-4.2 1.6L12 23l-1.8-4.3L6 17.1l4.2-1.6L12 11z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3>Detailed Report</h3>
          <p>Centering, corners, edges, and surface scores</p>
        </article>
      </section>

      <footer className="scan-footer">
        Card images are processed securely and not stored permanently
      </footer>
    </div>
  )
}

export default ScanCardsPage
