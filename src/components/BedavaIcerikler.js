import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BedavaIcerikler.css';

function BedavaIcerikler() {
  const [freePhotos, setFreePhotos] = useState([]);
  const [freeVideos, setFreeVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreeContent();
  }, []);

  const fetchFreeContent = async () => {
    try {
      setLoading(true);
      const photosResponse = await axios.get('http://localhost:5000/api/content/free-photo');
      const videosResponse = await axios.get('http://localhost:5000/api/content/free-video');
      setFreePhotos(photosResponse.data);
      setFreeVideos(videosResponse.data);
    } catch (error) {
      console.error('Error fetching free content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="bedava-icerikler">
      <h1>Bedava İçerikler</h1>
      
      <section className="free-photos">
        <h2>Fotoğraflar</h2>
        <div className="content-grid">
          {freePhotos.map(photo => (
            <div key={photo._id} className="content-item">
              <img src={photo.url} alt={photo.title} />
              <h3>{photo.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="free-videos">
        <h2>Videolar</h2>
        <div className="content-grid">
          {freeVideos.map(video => (
            <div key={video._id} className="content-item">
              <video src={video.url} controls></video>
              <h3>{video.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BedavaIcerikler;