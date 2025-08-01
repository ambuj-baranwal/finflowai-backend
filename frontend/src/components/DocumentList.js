import React from 'react';
import documentService from '../services/documentService';
import { useNotification } from '../context/NotificationContext';
import './DocumentList.css';

const DocumentList = ({ documents, loading, onDeleteSuccess }) => {
  const { addNotification } = useNotification();

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      documentService.deleteDocument(docId)
        .then(() => {
          addNotification('Document deleted successfully.');
          onDeleteSuccess(); // Callback to refresh list
        })
        .catch(err => {
          addNotification('Failed to delete document.', 'error');
        });
    }
  };

  if (loading) return <p>Loading documents...</p>;

  return (
    <div className="document-list-container">
      {documents.length === 0 ? (
        <p>No documents found. Upload one to get started!</p>
      ) : (
        <table className="document-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>File Type</th>
              <th>Uploaded On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td><span className={`file-type-badge ${doc.fileType}`}>{doc.fileType}</span></td>
                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="action-button delete" onClick={() => handleDelete(doc._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DocumentList;