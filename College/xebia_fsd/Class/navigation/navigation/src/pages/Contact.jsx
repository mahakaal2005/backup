import React, { useState } from 'react'
import '../styles/pages.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="page-container">
      <section className="contact-section">
        <h1>Contact Us</h1>
        <p className="subtitle">We'd love to hear from you. Get in touch with us today!</p>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <h3> Address</h3>
              <p>123 Main Street<br />New York, NY 10001<br />USA</p>
            </div>
            <div className="info-item">
              <h3> Email</h3>
              <p><a href="mailto:hello@example.com">hello@example.com</a></p>
            </div>
            <div className="info-item">
              <h3>📱 Phone</h3>
              <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </div>
            <div className="info-item">
              <h3> Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                 Saturday - Sunday: Closed</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>

        {submitted && (
          <div className="success-message">
            ✓ Thank you! Your message has been sent successfully.
          </div>
        )}
      </section>
    </div>
  )
}

export default Contact
