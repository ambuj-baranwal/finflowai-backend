import api from './api';

const generateMindMap = (documentId) => {
  console.log(`Generating Mind Map for document: ${documentId}`);
  // This is a mocked call. The backend doesn't have this endpoint yet.
  // It simulates returning data compatible with a library like React Flow.
  return new Promise(resolve => {
    setTimeout(() => {
      const mockMindMapData = {
        nodes: [
          { id: '1', type: 'input', data: { label: 'Main Document Topic' }, position: { x: 250, y: 5 } },
          { id: '2', data: { label: 'Key Concept 1' }, position: { x: 100, y: 100 } },
          { id: '3', data: { label: 'Key Concept 2' }, position: { x: 400, y: 100 } },
          { id: '4', data: { label: 'Detail A' }, position: { x: 50, y: 200 } },
          { id: '5', data: { label: 'Detail B' }, position: { x: 450, y: 200 } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e1-3', source: '1', target: '3' },
          { id: 'e2-4', source: '2', target: '4' },
          { id: 'e3-5', source: '3', target: '5' },
        ],
      };
      resolve({ data: mockMindMapData });
    }, 1500);
  });
};

const mindMapService = {
  generateMindMap,
};

export default mindMapService;