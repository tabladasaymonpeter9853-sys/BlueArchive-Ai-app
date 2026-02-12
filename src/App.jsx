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
          <div key="home" className="animate-page">
            <LandingPage
              onStart={() => setActiveTab('chat')}
              onInfo={() => setActiveTab('about')}
              onAbout={() => setActiveTab('about')}
            />
          </div>
        )}
        {activeTab === 'about' && (
          <div key="about" className="animate-page">
            <AboutPage
              onBack={() => setActiveTab('home')}
              onHome={() => setActiveTab('home')}
              onAbout={() => setActiveTab('about')}
            />
          </div>
        )}
        {activeTab === 'chat' && (
          <div key="chat" className="animate-page">
            <ChatInterface
              onHome={() => setActiveTab('home')}
              onAbout={() => setActiveTab('about')}
            />
          </div>
        )}
      </ThemeRoot>
    </ThemeProvider>
  );
}

export default App;