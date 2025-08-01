import React, { useState } from 'react';
import documentService from '../services/documentService';
import { useNotification } from '../context/NotificationContext'; // Import
import './DocumentUpload.css';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification(); // Use notification hook

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addNotification('Please select a file to upload.', 'error');
      return;
    }
    setLoading(true);

    const mockCloudUrl = `https://mock-storage.com/${Date.now()}-${file.name}`;
    const fileType = file.name.split('.').pop();
    
    try {
      await documentService.createDocument(file.name, fileType, mockCloudUrl);
      addNotification('Document uploaded successfully!');
      onUploadSuccess(); // Callback to refresh the list
      setFile(null);
      e.target.reset(); // Reset file input
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to upload document.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" onChange={handleFileChange} disabled={loading} />
        <button type="submit" className="upload-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;