export const ROUTES = {
  landing: '#/',
  login: '#/login',
  register: '#/register',
  otp: '#/otp',
  dashboard: '#/dashboard',
  profile: '#/profile',
  scan: '#/scan',
  collection: '#/collection',
  collectionDetails: '#/collection-details',
  gallery: '#/gallery',
  buyCredits: '#/buy-credits',
  faq: '#/faq',
}

export const normalizeHash = (hash) => {
  const rawHash = hash || ROUTES.landing
  return rawHash.split('?')[0]
}

export const navigateTo = (hash) => {
  window.location.hash = hash
}
