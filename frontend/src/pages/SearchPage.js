import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import searchService from '../services/searchService';
import './SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResults(null);
    try {
      const res = await searchService.search(query);
      setResults(res.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ documents: [], messages: [] }); // Set empty results on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page-container">
      <Sidebar />
      <main className="search-main-content">
        <header className="search-header">
          <h1>Global Search</h1>
        </header>
        
        <form onSubmit={handleSearch} className="search-bar-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across documents and chats..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="search-results-container">
          {loading && <p>Loading results...</p>}
          {results && (
            <>
              <div className="results-section">
                <h2>Documents ({results.documents.length})</h2>
                {results.documents.length > 0 ? (
                  results.documents.map(doc => (
                    <div key={doc._id} className="result-item document-item">
                      <p className="item-title">{doc.title}</p>
                      <span className={`file-type-badge ${doc.fileType}`}>{doc.fileType}</span>
                    </div>
                  ))
                ) : (
                  <p>No documents found.</p>
                )}
              </div>

              <div className="results-section">
                <h2>Messages ({results.messages.length})</h2>
                {results.messages.length > 0 ? (
                  results.messages.map(msg => (
                    <div key={msg._id} className="result-item message-item">
                      <p className={`item-content ${msg.role}`}>{msg.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No messages found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;