import React, { useState } from 'react';
// @ts-ignore
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
    alert('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">
          Contact Us
        </h1>
        <p className="contact-subtitle">
          Ready to secure your future? Let's talk about how Genstro Intelligence can protect your organization.
        </p>
      </div>

      <div className="contact-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your.email@company.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="How can we help?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="form-textarea"
              placeholder="Tell us about your security needs..."
            />
          </div>

          <button
            type="submit"
            className="form-submit-btn"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="contact-info-section">
        <h2 className="contact-info-title">Other Ways to Reach Us</h2>
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <h3>Email</h3>
            <p>contact@genstrointelligence.com</p>
          </div>
          <div className="contact-info-item">
            <h3>Security Hotline</h3>
            <p>1-800-SECURE-NOW</p>
          </div>
          <div className="contact-info-item">
            <h3>Response Time</h3>
            <p>&lt; 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;