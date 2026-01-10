import { ROUTES } from '../routes'

export const dashboardMenuItems = [
  { label: 'Dashboard', route: ROUTES.dashboard },
  { label: 'Scan card', route: ROUTES.scan },
  { label: 'Collection', route: ROUTES.collection },
  { label: 'Raw cards (filter)', isFilter: true, filterKey: 'raw' },
  { label: 'Graded cards (filter)', isFilter: true, filterKey: 'graded' },
  { label: 'Investment' },
  { label: 'Market places' },
]

export const dashboardSettingsItems = [
  { label: 'Profile', route: ROUTES.profile },
  { label: 'Connections (marketplaces)' },
  { label: 'Subscriptions' },
  { label: 'Invoices' },
]
