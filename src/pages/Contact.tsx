import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Contact.css';

const Contact: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan');
  const product = params.get('product');
  const initialSubject = plan ? `Pricing inquiry - ${plan} tier` : product ? `${product} briefing request` : '';
  const [formData, setFormData] = useState({ name: '', email: '', subject: initialSubject, message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-title">
        <p className="contact-kicker">Strategic intake</p>
        <h1 id="contact-title">Start with the signal that matters.</h1>
        <p>Tell us what is changing, what is at risk, or where confidence is missing. We will direct your inquiry to the right intelligence team.</p>
      </section>

      <section className="contact-workspace" aria-label="Contact Genstro Intelligence">
        <aside className="contact-brief">
          <p className="contact-kicker">Briefing desk</p>
          <h2>Bring the problem into focus.</h2>
          <dl>
            <div><dt>Response window</dt><dd>9:30 AM - 10:00 PM</dd></div>
            <div><dt>Direct channel</dt><dd><a href="mailto:support@genstrointelligence.com">support@genstrointelligence.com</a></dd></div>
            <div><dt>Typical starting point</dt><dd>Executive briefing, platform review, or security assessment.</dd></div>
          </dl>
        </aside>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success" role="status"><span>Received</span><h2>Your briefing request is in the queue.</h2><p>Thank you. A Genstro specialist will follow up using the contact details you provided.</p><button type="button" onClick={() => setSubmitted(false)}>Send another request <span aria-hidden="true">↗</span></button></div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-head"><span>01</span><p>Describe the context. We will take it from there.</p></div>
              <div className="contact-field-grid">
                <label>Full name<input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" placeholder="Your name" /></label>
                <label>Work email<input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder="you@company.com" /></label>
              </div>
              <label>Inquiry subject<input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="What would you like to discuss?" /></label>
              <label>Context<textarea name="message" value={formData.message} onChange={handleChange} required rows={7} placeholder="Include the challenge, decision, or capability you want to explore." /></label>
              <button className="contact-submit" type="submit">Send briefing request <span aria-hidden="true">↗</span></button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contact;
