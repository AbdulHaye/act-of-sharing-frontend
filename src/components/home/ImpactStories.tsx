import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../../styles/impact-stories.css';
import axiosInstance from '../../api/axiosInstance'; // Adjust the path based on your project structure

interface StoryProps {
  image: string;
  quote: string;
  name: string;
  location: string;
  amount: string;
  need: string;
}

const ImpactStories: React.FC = () => {
  const [stories, setStories] = useState<StoryProps[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get('/stories?page=1&limit=10', {
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.data || !Array.isArray(response.data.stories)) {
          throw new Error("Invalid data format from the server");
        }

        const fetchedStories = response.data.stories.map((story: any) => ({
          image: `http://localhost:5000/${story.image}`, // Construct full image URL
          quote: story.quote,
          name: story.name,
          location: story.location,
          amount: "N/A", // Amount is not in API response, using placeholder
          need: story.category, // Map 'category' to 'need'
        }));
        setStories(fetchedStories);
      } catch (err: any) {
        setError(err.message || "Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Handle loading state
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  // Handle empty state
  if (stories.length === 0) {
    return <div className="text-center py-5">No stories available</div>;
  }

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