import React, { useState } from 'react';

export default function ProjectModal({ isOpen, onClose, onSubmitSuccess }) {
  const [scope, setScope] = useState('flagship');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    setName('');
    setEmail('');
    setNotes('');
    setScope('flagship');
    onSubmitSuccess('Project brief submitted! Our team will contact you within 24 hours.');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} id="projectModal" onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close" id="closeProjectModal" aria-label="Close modal" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="modal-header">
          <div className="section-kicker">
            <span className="kicker-dot"></span> PROJECT INITIATION
          </div>
          <h3 className="modal-title">Let's Build Something Exceptional</h3>
          <p className="modal-subtitle">Select your requirements and our solutions architect will reach out.</p>
        </div>

        <form id="projectModalForm" className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Estimated Project Scope</label>
            <div className="budget-options">
              <label className="budget-pill">
                <input
                  type="radio"
                  name="scope"
                  value="flagship"
                  checked={scope === 'flagship'}
                  onChange={(e) => setScope(e.target.value)}
                />
                <span>Flagship Platform ($50k - $150k)</span>
              </label>
              <label className="budget-pill">
                <input
                  type="radio"
                  name="scope"
                  value="enterprise"
                  checked={scope === 'enterprise'}
                  onChange={(e) => setScope(e.target.value)}
                />
                <span>Enterprise Transformation ($150k+)</span>
              </label>
              <label className="budget-pill">
                <input
                  type="radio"
                  name="scope"
                  value="ai_poc"
                  checked={scope === 'ai_poc'}
                  onChange={(e) => setScope(e.target.value)}
                />
                <span>AI Prototype / POC ($25k - $50k)</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modalName">Name</label>
              <input
                type="text"
                id="modalName"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="modalEmail">Email</label>
              <input
                type="email"
                id="modalEmail"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modalNotes">Project Summary</label>
            <textarea
              id="modalNotes"
              rows="3"
              placeholder="Tell us about the project goals, target audience, and launch date..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-pill-white btn-modal-submit">
            Submit Project Brief
          </button>
        </form>
      </div>
    </div>
  );
}
