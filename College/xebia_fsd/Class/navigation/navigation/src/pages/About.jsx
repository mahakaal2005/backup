import React from 'react'
import '../styles/pages.css'

function About() {
  return (
    <div className="page-container">
      <section className="about-section">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            We are a dedicated team passionate about creating exceptional digital experiences.
            With years of expertise in web development and design, we strive to deliver
            innovative solutions that exceed expectations.
          </p>
          <h2>Our Mission</h2>
          <p>
            To empower businesses and individuals through cutting-edge technology and
            outstanding customer service.
          </p>
          <h2>Our Values</h2>
          <ul className="values-list">
            <li>Innovation - Constantly improving and evolving</li>
            <li>Quality - Excellence in every project</li>
            <li>Integrity - Honest and transparent dealings</li>
            <li>Customer Focus - Your success is our success</li>
          </ul>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍💼</div>
            <h3>John Developer</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍💼</div>
            <h3>Jane Designer</h3>
            <p>UI/UX Designer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>Mike Manager</h3>
            <p>Project Manager</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
