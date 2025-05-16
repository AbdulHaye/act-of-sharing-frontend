import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../../styles/impact-stories.css';







interface StoryProps {
  image: string;
  quote: string;
  name: string;
  location: string;
  amount: string;
  need: string;
}

const ImpactStories: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const stories: StoryProps[] = [
    {
      image: "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "When my family lost everything in the fire, I didn't know where to turn. The support from the meal gathering gave us hope and helped us secure a temporary home while we rebuild.",
      name: "Sarah Thompson",
      location: "Portland, OR",
      amount: "$3,850",
      need: "Home fire recovery"
    },
    {
      image: "https://images.pexels.com/photos/5759232/pexels-photo-5759232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "After my son was diagnosed with a rare condition, the medical bills were overwhelming. The generosity from our community meal helped cover his treatments when insurance fell short.",
      name: "Marcus Johnson",
      location: "Atlanta, GA",
      amount: "$5,200",
      need: "Medical expenses"
    },
    {
      image: "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      quote: "As a single mom, starting my small business seemed impossible. The meal gathering raised funds for my equipment and first month's rental space. I'm now employing two others!",
      name: "Elena Rodriguez",
      location: "Austin, TX",
      amount: "$4,300",
      need: "Small business startup"
    }
  ];

  const nextStory = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  return (
    <section className="impact-stories py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title">Real Impact Stories</h2>
            <p className="section-subtitle">
              See how meals with purpose have changed lives in our communities
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="story-carousel">
              <div className="story-content">
                <div className="row align-items-center">
                  <div className="col-md-5 mb-4 mb-md-0">
                    <div className="story-image-container">
                      <img 
                        src={stories[activeIndex].image} 
                        alt={stories[activeIndex].name} 
                        className="story-image img-fluid"
                      />
                      <div className="story-amount">{stories[activeIndex].amount}</div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="story-text">
                      <div className="story-quote">
                        "{stories[activeIndex].quote}"
                      </div>
                      <div className="story-meta">
                        <div className="story-name">{stories[activeIndex].name}</div>
                        <div className="story-details">
                          <span className="story-location">{stories[activeIndex].location}</span>
                          <span className="story-divider">•</span>
                          <span className="story-need">{stories[activeIndex].need}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="story-navigation">
                <button 
                  className="story-nav-btn" 
                  onClick={prevStory}
                  aria-label="Previous story"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="story-indicators">
                  {stories.map((_, index) => (
                    <button 
                      key={index}
                      className={`story-indicator ${activeIndex === index ? 'active' : ''}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to story ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  className="story-nav-btn" 
                  onClick={nextStory}
                  aria-label="Next story"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStories;