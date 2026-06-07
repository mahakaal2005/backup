import './ProductCard.css'

function ProductCard({ product, onAddToCart, onRemoveFromCart, isInCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="price">${product.price}</span>
          {isInCart ? (
            <button 
              className="btn btn-remove" 
              onClick={() => onRemoveFromCart(product.id)}
            >
              Remove from Cart
            </button>
          ) : (
            <button 
              className="btn btn-add" 
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
