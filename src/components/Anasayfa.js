import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Anasayfa.css';

function Anasayfa() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://jsonplaceholder.typicode.com/photos?_limit=12');
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="anasayfa">
      <h1>Hoş Geldiniz</h1>
      <p>En son içeriklerimize göz atın.</p>
      <div className="content-grid">
        {content.map(item => (
          <div key={item.id} className="content-item">
            <img src={item.thumbnailUrl} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Anasayfa;