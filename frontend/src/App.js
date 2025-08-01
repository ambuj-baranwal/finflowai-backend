import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StoragePage from './pages/StoragePage';
import SearchPage from './pages/SearchPage';
import MindMapPage from './pages/MindMapPage';
import FlowchartPage from './pages/FlowchartPage';
import AuthProvider from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/" 
                element={ <PrivateRoute><ChatPage /></PrivateRoute> } 
              />
              <Route 
                path="/storage"
                element={ <PrivateRoute><StoragePage /></PrivateRoute> }
              />
              <Route 
                path="/search"
                element={ <PrivateRoute><SearchPage /></PrivateRoute> }
              />
              <Route 
                path="/mindmap"
                element={ <PrivateRoute><MindMapPage /></PrivateRoute> }
              />
              <Route 
                path="/flowchart"
                element={ <PrivateRoute><FlowchartPage /></PrivateRoute> }
              />
            </Routes>
          </div>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;