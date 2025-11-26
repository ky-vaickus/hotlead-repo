import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import { AgentType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(AgentType.RECRUITING);

  const handleSelectAgent = (type: AgentType) => {
    setSelectedAgent(type);
    setCurrentView('chat');
  };

  const handleBack = () => {
    setCurrentView('landing');
  };

  return (
    <div className="antialiased text-gray-900">
      {currentView === 'landing' ? (
        <LandingPage onSelectAgent={handleSelectAgent} />
      ) : (
        <ChatInterface agentType={selectedAgent} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;
