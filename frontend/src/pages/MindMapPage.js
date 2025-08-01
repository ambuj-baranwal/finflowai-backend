import React from 'react';
import AIFeaturePage from './AIFeaturePage';
import mindMapService from '../services/mindMapService';

const MindMapPage = () => {
  return (
    <AIFeaturePage 
      featureName="Mind Map"
      onGenerate={mindMapService.generateMindMap}
    />
  );
};

export default MindMapPage;