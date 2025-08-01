import api from './api';

const generateFlowchart = (documentId) => {
  console.log(`Generating Flowchart for document: ${documentId}`);
  // This is a mocked call, simulating flowchart data generation.
  return new Promise(resolve => {
    setTimeout(() => {
      const mockFlowchartData = {
        nodes: [
            { id: '1', type: 'input', data: { label: 'Start Process' }, position: { x: 250, y: 5 } },
            { id: '2', data: { label: 'Step 1: Analyze Data' }, position: { x: 250, y: 100 } },
            { id: '3', data: { label: 'Step 2: Make Decision' }, position: { x: 250, y: 200 } },
            { id: '4', type: 'output', data: { label: 'End Process' }, position: { x: 250, y: 300 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3', animated: true },
            { id: 'e3-4', source: '3', target: '4', animated: true },
        ],
      };
      resolve({ data: mockFlowchartData });
    }, 1500);
  });
};

const flowchartService = {
  generateFlowchart,
};

export default flowchartService;