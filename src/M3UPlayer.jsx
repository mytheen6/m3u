// src/components/M3UPlayer.jsx
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { parseM3U } from './parseM3U';
import './App.css';

const M3UPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilteredPlaylist(
      playlist.filter(track => 
        track.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, playlist]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const parsedPlaylist = parseM3U(event.target.result);
      setPlaylist(parsedPlaylist);
      setFilteredPlaylist(parsedPlaylist);
      setCurrentTrackIndex(0);
    };
    reader.readAsText(file);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % filteredPlaylist.length);
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + filteredPlaylist.length) % filteredPlaylist.length);
  };

  return (
    <div>
      <h1>M3U Player</h1>
      <input type="file" accept=".m3u" onChange={handleFileUpload} />
      {playlist.length > 0 && (
        <div>
          <input 
            type="text" 
            placeholder="Search channels" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <h2>Now Playing: {filteredPlaylist[currentTrackIndex]?.title || 'N/A'}</h2>
          <ReactPlayer
            className="ReactPlayer"
            url={filteredPlaylist[currentTrackIndex]?.url || ''}
            playing={playing}
            controls={true}
            onEnded={handleNextTrack}
          />
          <div>
            <button onClick={handlePreviousTrack}>Previous</button>
            <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
            <button onClick={handleNextTrack}>Next</button>
          </div>
          <ul>
            {filteredPlaylist.map((track, index) => (
              <li
                key={index}
                className={index === currentTrackIndex ? 'active' : ''}
                onClick={() => setCurrentTrackIndex(index)}
              >
                {track.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default M3UPlayer;

