import React from 'react';

export default function Toast({ message, isVisible }) {
  return (
    <div className={`toast-notification ${isVisible ? 'show' : ''}`} id="toastNotification">
      <div className="toast-icon">
        <i className="fa-solid fa-circle-check"></i>
      </div>
      <div className="toast-msg" id="toastMessage">
        {message || 'Inquiry transmitted successfully!'}
      </div>
    </div>
  );
}
