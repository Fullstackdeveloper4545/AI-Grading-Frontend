import { useMemo, useState } from 'react'
import { ROUTES, navigateTo } from '../routes'

const assetFiles = [
  'image.png',
  'image copy.png',
  'image copy 2.png',
  'image copy 3.png',
  'image copy 4.png',
  'image copy 5.png',
  'image copy 6.png',
  'image copy 7.png',
  'image copy 8.png',
  'image copy 9.png',
  'image copy 10.png',
  'image copy 11.png',
  'image copy 12.png',
  'image copy 13.png',
  'image copy 14.png',
  'image copy 15.png',
  'image copy 16.png',
  'image copy 17.png',
  'image copy 18.png',
  'image copy 19.png',
  'image copy 20.png',
  'image copy 21.png',
  'image copy 22.png',
  'image copy 23.png',
  'image copy 24.png',
  'image copy 25.png',
  'image copy 26.png',
  'image copy 27.png',
  'image copy 28.png',
  'image copy 30.png',
  'image copy 31.png',
  'image copy 32.png',
]

const galleryItems = assetFiles.map((file, index) => ({
  id: index + 1,
  title: `Pokemon Card ${index + 1}`,
  image: new URL(`../assets/${file}`, import.meta.url).href,
}))

function GalleryPage() {
  const pageSize = 10
  const totalPages = Math.ceil(galleryItems.length / pageSize)
  const [currentPage, setCurrentPage] = useState(1)

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return galleryItems.slice(start, start + pageSize)
  }, [currentPage])

  const pageNumbers = useMemo(() => {
    const pages = [1, 2, 3, 4, 5]
    if (totalPages > 10) {
      pages.push(6, 7, 8, 9, 10)
    }
    return pages.filter((page) => page <= totalPages)
  }, [totalPages])

  const tailPages = useMemo(() => {
    if (totalPages <= 12) {
      return []
    }
    return [totalPages - 1, totalPages]
  }, [totalPages])

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }
    setCurrentPage(page)
  }

  return (
    <div className="gallery-page">
      <header className="gallery-nav">
        <div className="gallery-logo">FreeGrading</div>
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
          className="gallery-user"
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

      <main className="gallery-main">
        <section className="gallery-hero">
          <h1>TCG Gallery</h1>
          <p>Take a look in our TCG gallery with the latest AI graded cards.</p>
        </section>

        <section className="gallery-grid">
          {pagedItems.map((item, index) => (
            <article key={item.id} className="gallery-card">
              <img
                className={`gallery-card-image variant-${(index % 4) + 1}`}
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
              <span className="gallery-card-title">{item.title}</span>
            </article>
          ))}
        </section>

        <div className="gallery-pagination">
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          {tailPages.length > 0 && (
            <>
              <span className="page-ellipsis">...</span>
              {tailPages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
            </>
          )}
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </main>
    </div>
  )
}

export default GalleryPage
