import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import DocumentList from '../components/DocumentList';
import DocumentUpload from '../components/DocumentUpload';
import documentService from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import './StoragePage.css';

const StoragePage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchDocuments = useCallback(() => {
    setLoading(true);
    documentService.getDocuments()
      .then(res => setDocuments(res.data.documents))
      .catch(err => addNotification('Failed to fetch documents.', 'error'))
      .finally(() => setLoading(false));
  }, [addNotification]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="storage-page-container">
      <Sidebar />
      <main className="storage-main-content">
        <header className="storage-header">
          <h1>Document Storage</h1>
          <DocumentUpload onUploadSuccess={fetchDocuments} />
        </header>
        <DocumentList 
          documents={documents} 
          loading={loading} 
          onDeleteSuccess={fetchDocuments} 
        />
      </main>
    </div>
  );
};

export default StoragePage;