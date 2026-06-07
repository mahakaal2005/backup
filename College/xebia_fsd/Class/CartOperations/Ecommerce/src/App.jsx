import { useState } from 'react'
import ProductList from './components/ProductList'
import Header from './components/Header'
import CartPage from './components/CartPage'
import './App.css'

function App() {
  // Sample products data
  const [products] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 49.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      description: 'Feature-rich smartwatch with fitness tracking',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'USB-C Cable',
      price: 12.99,
      description: 'Durable 2-meter USB-C charging cable',
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Phone Case',
      price: 19.99,
      description: 'Protective phone case with shock absorption',
      image: 'https://images.unsplash.com/photo-1596532686326-4126d2eaf82b?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'Screen Protector',
      price: 9.99,
      description: 'Tempered glass screen protector for phones',
      image: 'https://images.unsplash.com/photo-1609994238941-552416be64ee?w=300&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Phone Stand',
      price: 14.99,
      description: 'Adjustable phone stand for desk or table',
      image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=300&h=200&fit=crop'
    }
  ])

  // Cart state
  const [cart, setCart] = useState([])
  const [view, setView] = useState('products')
  const [searchTerm, setSearchTerm] = useState('')

  // Function to add product to cart
  const addToCart = (product) => {
    setCart([...cart, product])
  }

  // Function to remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    )
  })

  return (
    <>
      <div className="app-container">
        <Header
          cartCount={cart.length}
          totalPrice={totalPrice}
          activeView={view}
          onHomeClick={() => setView('products')}
          onCartClick={() => setView('cart')}
          searchValue={searchTerm}
          onSearchChange={(event) => setSearchTerm(event.target.value)}
        />

        <main className="app-main">
          {view === 'cart' ? (
            <CartPage
              cartItems={cart}
              totalPrice={totalPrice}
              onContinueShopping={() => setView('products')}
            />
          ) : (
            <ProductList
              products={filteredProducts}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              cartItems={cart}
            />
          )}
        </main>
      </div>
    </>
  )
}

export default App
