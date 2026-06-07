import './CartPage.css'

function CartPage({ cartItems, totalPrice, onContinueShopping }) {
  return (
    <section className="cart-page">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="continue-btn" type="button" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price}</span>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>

          <div className="cart-form">
            <h4>Shipping Address</h4>
            <form className="address-form">
              <label>
                Full Name
                <input type="text" name="fullName" placeholder="John Doe" />
              </label>
              <label>
                Address
                <input type="text" name="address" placeholder="123 Main St" />
              </label>
              <label>
                City
                <input type="text" name="city" placeholder="New York" />
              </label>
              <label>
                ZIP Code
                <input type="text" name="zip" placeholder="10001" />
              </label>
              <label>
                Phone
                <input type="tel" name="phone" placeholder="+1 555 123 4567" />
              </label>
              <button type="button" className="checkout-btn">Checkout</button>
            </form>
          </div>
        </>
      )}
    </section>
  )
}

export default CartPage
