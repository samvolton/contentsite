const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api/media/batch';
const TOKEN = process.env.AUTH_TOKEN;

if (!TOKEN) {
  console.error('No AUTH_TOKEN provided in environment variables');
  process.exit(1);
}

async function performBatchUpload(folderPath, category) {
  try {
    const formData = new FormData();
    formData.append('category', category);

    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      formData.append('files', fs.createReadStream(filePath), file);
    });

    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    
    console.log('Batch upload results:', response.data);
  } catch (error) {
    console.error('Batch upload failed:', error.response ? error.response.data : error.message);
  }
}

// Usage
const folderPath = '/path/to/your/folder'; // Replace with the actual folder path
const category = 'foto'; // or 'video', depending on the content

performBatchUpload(folderPath, category);