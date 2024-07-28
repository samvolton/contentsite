// VideoCarousel.js
import React, { useState, useEffect } from 'react';

function VideoCarousel({ videos, onItemClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [videos.length]);

  if (videos.length === 0) {
    return <div>No videos available</div>;
  }

  return (
    <div className="slider">
      <div 
        className="slider-container" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div key={index} className="slide" onClick={() => onItemClick(video)}>
            <video src={video.url} poster={video.thumbnail} />
            <h3>{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoCarousel;