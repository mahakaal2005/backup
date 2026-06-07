import React from 'react'
import '../styles/pages.css'

function Home() {
  return (
    <div className="page-container">
      <section className="hero-section">
        <h1>Welcome to Our Website</h1>
        <p>Discover amazing content and explore our services</p>
        <button className="cta-button">Get Started</button>
      </section>

      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast & Reliable</h3>
            <p>High-performance solutions built with modern technology</p>
          </div>
          <div className="feature-card">
            <h3>User Friendly</h3>
            <p>Intuitive interface designed for everyone</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Always here to help you with your needs</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
