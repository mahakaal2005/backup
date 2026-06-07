import ProductCard from './ProductCard'
import './ProductList.css'

function ProductList({ products, onAddToCart, onRemoveFromCart, cartItems }) {
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            isInCart={cartItems.some((item) => item.id === product.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList
