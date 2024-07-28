// ImageCarousel.js
import React, { useState, useEffect } from 'react';

function ImageCarousel({ images, onItemClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="slider">
      <div 
        className="slider-container" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="slide" onClick={() => onItemClick(image)}>
            <img src={image.url} alt={image.title} />
            <h3>{image.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;