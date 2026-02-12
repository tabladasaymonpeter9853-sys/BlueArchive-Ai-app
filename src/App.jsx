import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeRoot from './components/ThemeRoot';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AboutPage from './components/AboutPage';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, about, chat

  return (
    <ThemeProvider>
      <ThemeRoot>
      {activeTab === 'home' && (
        <LandingPage
          onStart={() => setActiveTab('chat')}
          onInfo={() => setActiveTab('about')}
          onAbout={() => setActiveTab('about')}
        />
      )}
      {activeTab === 'about' && (
        <AboutPage
          onBack={() => setActiveTab('home')}
          onHome={() => setActiveTab('home')}
          onAbout={() => setActiveTab('about')}
        />
      )}
      {activeTab === 'chat' && (
        <ChatInterface
          onHome={() => setActiveTab('home')}
          onAbout={() => setActiveTab('about')}
        />
      )}
      </ThemeRoot>
    </ThemeProvider>
  );
}

export default App;