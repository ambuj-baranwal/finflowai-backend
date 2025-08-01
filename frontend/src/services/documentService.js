import api from './api';

const getDocuments = () => {
  return api.get('/documents');
};

const createDocument = (title, fileType, cloudReferenceUrl) => {
  return api.post('/documents', { title, fileType, cloudReferenceUrl });
};

const deleteDocument = (documentId) => {
  return api.delete(`/documents/${documentId}`);
};


const documentService = {
  getDocuments,
  createDocument,
  deleteDocument,
};

export default documentService;