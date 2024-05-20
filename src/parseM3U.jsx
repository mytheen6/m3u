// src/utils/parseM3U.js
export const parseM3U = (m3uContent) => {
  const lines = m3uContent.split('\n');
  const playlist = [];
  let currentTrack = {};

  lines.forEach((line) => {
    if (line.startsWith('#EXTINF:')) {
      const info = line.split(',');
      currentTrack = {
        duration: info[0].split(':')[1].trim(),
        title: info[1].trim(),
      };
    } else if (line.startsWith('http') || line.startsWith('https')) {
      currentTrack.url = line.trim();
      playlist.push(currentTrack);
      currentTrack = {};
    }
  });

  return playlist;
};

