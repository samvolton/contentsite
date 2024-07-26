import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Video.css';

function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/content/video');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    if (video.isPremium) {
      navigate('/premium');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="video">
      <h1>Video Galerisi</h1>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video._id} className="video-item" onClick={() => handleVideoClick(video)}>
            <video src={video.thumbnailUrl} className={video.isPremium ? 'blurred' : ''} />
            <div className="video-overlay">
              <h3>{video.title}</h3>
              {video.isPremium && <span className="premium-badge">Premium</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Video;