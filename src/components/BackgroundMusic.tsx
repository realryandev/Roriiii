"use client"

import React, { useEffect, useRef } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Ensure the code runs only on the client-side.  This is crucial for Next.js
    if (typeof window === 'undefined') return;

    const startTime = 184;
    const endTime = 248;
    const audioFilePath = '/Frank Ocean - White Ferrari.mp3'; // Path relative to /public

    // Function to initialize and play audio
    const setupAndPlayAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFilePath);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
        audioRef.current.currentTime = startTime; // Set start time
      }

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully.
            audioRef.current?.addEventListener('timeupdate', () => {
              if (audioRef.current && audioRef.current.currentTime >= endTime) {
                audioRef.current.currentTime = startTime; // Loop
              }
            });
          })
          .catch(error => {
            // Autoplay was prevented.  Important for mobile.
            console.warn("Autoplay prevented:", error);
            // *DON'T* try to play again here without user interaction.
            //  Instead, wait for a user event (like a click).
          });
      }
    };

    // Attempt to play on initial load (for browsers that allow it)
    setupAndPlayAudio();

    // --- User Interaction Handling (for iOS and other browsers) ---
    const handleFirstInteraction = () => {
      setupAndPlayAudio(); // *RETRY* playing on user interaction
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction); // Also handle keypress
    };

    // Add event listeners for *any* user interaction.  Keydown is important for accessibility.
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    // --- Cleanup ---
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []); // Empty dependency array:  Run only once on mount

  return null; //  Don't render anything.  Audio is controlled via the ref.
};

export default BackgroundMusic;
