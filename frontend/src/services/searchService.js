import api from './api';

const search = (query) => {
  console.log(`Searching for: ${query}`);
  // This is a mocked call. The backend doesn't have this endpoint yet.
  // We simulate a search that returns documents and messages.
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResults = {
        documents: [
          { _id: 'doc1', title: `Report about ${query}`, fileType: 'pdf', createdAt: new Date() },
          { _id: 'doc2', title: 'Financial Analysis', fileType: 'xlsx', createdAt: new Date() },
        ],
        messages: [
          { _id: 'msg1', content: `User message discussing ${query}.`, role: 'user', chatSessionId: 'session1' },
          { _id: 'msg2', content: `Assistant response about ${query}.`, role: 'assistant', chatSessionId: 'session1' },
        ]
      };
      resolve({ data: mockResults });
    }, 1000); // Simulate network latency
  });
};

const searchService = {
  search,
};

export default searchService;