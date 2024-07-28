import React from 'react';
import './Modal.css';

function Modal({ content, onClose }) {
  const isImage = content.contentType.startsWith('image');
  const isVideo = content.contentType.startsWith('video');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isImage && <img src={`http://localhost:5000/files/${content.filename}`} alt={content.filename} />}
        {isVideo && <video src={`http://localhost:5000/files/${content.filename}`} controls />}
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
