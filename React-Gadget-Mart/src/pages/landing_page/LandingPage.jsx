import React, { useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
  };

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium sound quality with noise cancellation",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      description: "High-precision optical sensor for pro gamers",
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1028&q=80",
    },
    {
      id: 3,
      name: "Ultrabook Laptop",
      description: "Powerful performance in a slim design",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    },
    {
      id: 4,
      name: "Condenser Microphone",
      description: "Studio-quality audio recording",
      image:
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="title">
              Discover Amazing <span className="highlight">Gadgets</span>
            </h1>
            <p className="subtitle">
              Explore our curated collection of cutting-edge technology and
              innovative products designed to enhance your daily life.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn btn-primary">
                Shop Now
              </a>
              <button className="btn btn-secondary" onClick={openVideoModal}>
                Watch Video
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1573920011462-eb3003086611?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Latest gadgets"
            />
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <p className="stat-number">299K+</p>
            <p className="stat-label">Products</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">99K+</p>
            <p className="stat-label">Sellers</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">2K+</p>
            <p className="stat-label">Positive Reviews</p>
          </div>
        </div>
      </section>

      <section className="featured-products" id="products">
        <div className="container">
          <h2 className="title">Featured Products</h2>
          <p className="subtitle">
            Check out our latest and most popular gadgets that are
            revolutionizing the tech world.
          </p>
          <div className="products">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="title">Why Choose Us</h2>
          <p className="subtitle">
            We offer more than just products. Experience the difference with our
            unique features and services.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">
                Enjoy free shipping on all orders over $50
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-description">
                Your transactions are always safe and encrypted
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-description">
                30-day money-back guarantee on all purchases
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="container">
          <h2 className="title">What Our Customers Say</h2>
          <div className="testimonial-content">
            <p className="testimonial-text">
              "I've been a loyal customer for years, and I'm always impressed by
              the quality of products and excellent customer service. Highly
              recommended!"
            </p>
            <p className="testimonial-author">- Sarah Johnson</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Upgrade Your Tech?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers and experience the future of
            technology today.
          </p>
          <a href="#products" className="btn btn-secondary">
            Shop Now
          </a>
        </div>
      </section>

      {videoModalOpen && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button className="close-modal" onClick={closeVideoModal}>
              &times;
            </button>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
