import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import '../../styles/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="footer-brand d-flex align-items-center mb-3">
              <Heart size={24} className="me-2 text-primary" />
              <span className="h4 mb-0">COMMONCHANGE</span>
            </div>
            <p className="footer-tagline">
              Bringing communities together to share meals and make a difference through collective giving.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="mailto:contact@mealswithmission.org" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="col-sm-6 col-lg-2 mb-4 mb-lg-0">
            <h5 className="footer-heading">Get Started</h5>
            <ul className="footer-links">
              {/* <li><Link to="/create-event">Host a Meal</Link></li> */}
              <li><Link to="/how-it-works">How It Works</Link></li>
              {/* <li><Link to="/dashboard">My Events</Link></li> */}
              {/* <li><Link to="/stories">Success Stories</Link></li> */}
            </ul>
          </div>

          <div className="col-sm-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="footer-heading">Resources</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              {/* <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/host-guide">Host Guide</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/blog">Blog</Link></li> */}
            </ul>
          </div>

          <div className="col-lg-3">
            <h5 className="footer-heading">Subscribe</h5>
            <p className="subscribe-text">Stay updated with our mission and events</p>
            {/* <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
                aria-label="Email address" 
              />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div> */}
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="row footer-bottom">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-0">© {currentYear} COMMONCHANGE. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="footer-legal">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;