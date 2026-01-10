function DashboardSidebar({
  userName,
  userError,
  menuItems,
  settingsItems,
  activeItem,
  onSelectItem,
  filters = {},
  onToggleFilter,
  disableNoRoute = false,
}) {
  const renderFilterBadge = (label, isOpen, filterKey) => (
    <button
      type="button"
      className="dash-filter-pill"
      onClick={() => {
        if (onToggleFilter) {
          onToggleFilter(filterKey)
        }
      }}
    >
      <span className="dash-filter-icon">{isOpen ? '-' : '+'}</span>
      {label}
    </button>
  )

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-header">
        <span>USER MENU</span>
        <small>{userError || userName}</small>
      </div>

      <nav className="dash-menu">
        {menuItems.map((item) => {
          const filterInfo = item.isFilter ? filters[item.filterKey] : null
          const isActive = activeItem === item.label
          const isDisabled = disableNoRoute && !item.route

          return (
            <button
              key={item.label}
              type="button"
              className={`dash-item ${isActive ? 'active' : ''}`}
              disabled={isDisabled}
              onClick={() => {
                if (onSelectItem) {
                  onSelectItem(item)
                }
              }}
            >
              {filterInfo ? (
                <span className="dash-filter-row">
                  {renderFilterBadge(
                    filterInfo.label,
                    filterInfo.isOpen,
                    item.filterKey
                  )}
                </span>
              ) : (
                item.label
              )}
            </button>
          )
        })}
      </nav>

      <div className="dash-section-title">SETTINGS</div>

      <nav className="dash-menu">
        {settingsItems.map((item) => {
          const isActive = activeItem === item.label
          const isDisabled = disableNoRoute && !item.route

          return (
            <button
              key={item.label}
              type="button"
              className={`dash-item ${isActive ? 'active' : ''}`}
              disabled={isDisabled}
              onClick={() => {
                if (onSelectItem) {
                  onSelectItem(item)
                }
              }}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar
