import './Header.css'
import logo from '../assets/logo.svg'

function Header({
  cartCount,
  totalPrice,
  onCartClick,
  onHomeClick,
  activeView,
  searchValue,
  onSearchChange
}) {
  return (
    <header className="app-header">
      <button className="brand-button" onClick={onHomeClick} type="button">
        <img src={logo} alt="E-Commerce Store logo" className="logo" />
        <span className="brand-title">E-Commerce Store</span>
      </button>

      <div className="search-bar" role="search">
        <input
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>

      {activeView === 'cart' && (
        <div className="cart-info">
          <span>Items: {cartCount}</span>
          <span>Total: ${totalPrice.toFixed(2)}</span>
        </div>
      )}

      <button
        className={`cart-button ${activeView === 'cart' ? 'active' : ''}`}
        type="button"
        onClick={onCartClick}
        aria-label="Go to cart"
      >
        <span className="cart-icon" aria-hidden="true">🛒</span>
        <span>Cart</span>
      </button>
    </header>
  )
}

export default Header
