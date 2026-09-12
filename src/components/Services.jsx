import React from 'react';

export default function Services({ onOpenModal }) {
  return (
    <section className="services-section" id="services">
      <div className="container services-container">
        
        {/* CARD 1: REDEFINING MARKETING */}
        <div className="showcase-card card-light card-layout-media-left">
          {/* Media Box */}
          <div className="card-media-box card-media-dark">
            <img
              src="/assets/card-marketing-prism.jpg"
              alt="Redefining Marketing - 3D Crystal Prism"
              className="card-media-img"
              loading="lazy"
            />
          </div>

          {/* Content Box */}
          <div className="card-content-box">
            <div className="card-top-row">
              <div className="card-kicker kicker-blue">REDEFINING MARKETING</div>
              <div className="card-corner-index">01 / 03</div>
            </div>

            <h2 className="card-heading">
              The boost that you need <br />in the <span className="keyword-gradient">digital age</span>
            </h2>

            <p className="card-description">
              Reaching the customers is key in business and we are here to help you do that. Our focus is to combine the latest techniques of the digital world with the vision of our clients to create exceptional value. We are in the pursuit of redefining marketing in the digital age by optimising your digital presence.
            </p>

            <div className="card-bottom-row">
              <div className="card-pills-group">
                <button type="button" className="pill-badge pill-dark" onClick={onOpenModal}>
                  <i className="fa-solid fa-compass"></i>
                  <span>SEO &amp; SEM Integration</span>
                </button>
                <button type="button" className="pill-badge pill-outline" onClick={onOpenModal}>
                  <i className="fa-solid fa-chart-line"></i>
                  <span>Performance Marketing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: DIGITAL INFRASTRUCTURE (LIGHT THEME) */}
        <div className="showcase-card card-light card-layout-media-right">
          {/* Content Box */}
          <div className="card-content-box">
            <div className="card-top-row">
              <div className="card-kicker kicker-cyan">DIGITAL INFRASTRUCTURE</div>
              <div className="card-corner-index">02 / 03</div>
            </div>

            <h2 className="card-heading">
              Develop your digital <br /><span className="keyword-gradient">infrastructure</span>
            </h2>

            <p className="card-description">
              With the help of cutting-edge technology and expertise, we will be the architects of your digital dreams. Creating the digital identity of our clients by weaving lines of code as per the vision of the clients will be our main focus. An integrated approach to website development, App development and Web 3 development will be brought forward by AlphaCyrix.
            </p>

            <div className="card-bottom-row">
              <div className="card-pills-group">
                <button type="button" className="pill-badge pill-dark" onClick={onOpenModal}>
                  <i className="fa-solid fa-cube"></i>
                  <span>App &amp; Web Development</span>
                </button>
                <button type="button" className="pill-badge pill-outline" onClick={onOpenModal}>
                  <i className="fa-solid fa-layer-group"></i>
                  <span>Web 3 Solutions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Media Box */}
          <div className="card-media-box card-media-dark">
            <img
              src="/assets/card-digital-sphere.jpg"
              alt="Digital Infrastructure - 3D Cosmic Glass Sphere"
              className="card-media-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* CARD 3: STARTUP ACCELERATION */}
        <div className="showcase-card card-light card-layout-media-left">
          {/* Media Box */}
          <div className="card-media-box card-media-light">
            <img
              src="/assets/card-startup-sculpture.jpg"
              alt="Startup Acceleration - 3D Fluid Glass Sculpture"
              className="card-media-img"
              loading="lazy"
            />
          </div>

          {/* Content Box */}
          <div className="card-content-box">
            <div className="card-top-row">
              <div className="card-kicker kicker-red">STARTUP ACCELERATION</div>
              <div className="card-corner-index">03 / 03</div>
            </div>

            <h2 className="card-heading">
              Create without <br /><span className="keyword-gradient">boundaries</span>
            </h2>

            <p className="card-description">
              Turning the vision into real outcomes is the place where most startups fail. We have identified and studied the numerous challenges that can be faced by a new enterprise of any scale. With our knowledge and technical expertise we can facilitate our clients to tackle such challenges with creative and timely solutions.
            </p>

            <div className="card-bottom-row">
              <div className="card-pills-group">
                <button type="button" className="pill-badge pill-dark" onClick={onOpenModal}>
                  <i className="fa-solid fa-pen-nib"></i>
                  <span>UI/UX Design</span>
                </button>
                <button type="button" className="pill-badge pill-outline" onClick={onOpenModal}>
                  <i className="fa-solid fa-shapes"></i>
                  <span>Brand Identity</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
