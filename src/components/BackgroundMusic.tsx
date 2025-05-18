"use client"

import { useEffect, useRef } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Ensure the audio playback only happens on the client-side
    if (typeof window !== 'undefined') {
      // IMPORTANT: Next.js serves files in the 'public' directory at the root.
      // You should reference the file path relative to the 'public' directory.
      const audio = new Audio('/Frank Ocean - White Ferrari.mp3');
      audioRef.current = audio;
      audio.loop = true;
      audio.volume = 0.5;

      const startTime = 184;
      const endTime = 248;

      const playMusic = () => {
        if (audio) { // Use the local audio variable
          audio.currentTime = startTime;
          const playPromise = audio.play();

          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Autoplay started!
              audio.addEventListener('timeupdate', () => { // Use the local audio variable
                if (audio && audio.currentTime >= endTime) { // Use the local audio variable
                  audio.currentTime = startTime; // Loop back to start
                }
              });
            }).catch(error => {
              // Autoplay was prevented. Show a play button or handle it.
              console.warn("Autoplay was prevented", error);
            });
          }
        }
      };

      // Play the music when the component mounts
      playMusic();

      // Event listener for user interaction (for iOS and modern browsers) - attempt to play on first user interaction
      const handleFirstInteraction = () => {
        playMusic();
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true });


      // Cleanup function to pause the music when the component unmounts
      return () => {
        if (audio) { // Use the local audio variable
          audio.pause();
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        audioRef.current = null;
      };
    }
  }, []);

  // Important: We don't render the audio element. It is controlled via the ref.
  return null;
};

export default BackgroundMusic;
