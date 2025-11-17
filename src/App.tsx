
import React from 'react';
import VideoSearch from './components/VideoSearch';
import TextToSpeech from './components/TextToSpeech';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>YouTube 视频筛选与语音工具</h1>
      </header>
      <main className="app-main">
        <div className="container">
          <VideoSearch />
          <TextToSpeech />
        </div>
      </main>
    </div>
  );
}

export default App;
