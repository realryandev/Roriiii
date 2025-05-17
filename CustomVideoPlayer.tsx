'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'; // Using lucide-react for icons

interface CustomVideoPlayerProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean; // Initial muted state
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  width = 300,
  height = 400,
  className = '',
  autoPlay = false,
  loop = false,
  muted: initialMuted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  let controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused || videoRef.current.ended) {
        videoRef.current.play().catch(error => console.error("Error playing video:", error));
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.5; // Restore to a default volume if unmuting from 0
        setVolume(0.5);
      } else if (newMutedState) {
        setVolume(0); // Reflect mute in volume slider visually
      }
    }
  };


  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (autoPlay) {
          videoRef.current.play().catch(error => console.error("Error auto-playing video:", error));
          setIsPlaying(true);
      }
      if (initialMuted) {
        videoRef.current.muted = true;
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullScreen = () => {
    const playerElement = videoRef.current?.parentElement?.parentElement; // Adjust if your structure is different
    if (!playerElement) return;

    if (!document.fullscreenElement) {
        playerElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updatePlayingState = () => setIsPlaying(!video.paused);
      video.addEventListener('play', updatePlayingState);
      video.addEventListener('pause', updatePlayingState);
      video.addEventListener('ended', () => setIsPlaying(false));
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('volumechange', () => {
        if(videoRef.current) {
            setIsMuted(videoRef.current.muted);
            setVolume(videoRef.current.muted ? 0 : videoRef.current.volume);
        }
      });

      // Set initial muted state
      video.muted = initialMuted;

      return () => {
        video.removeEventListener('play', updatePlayingState);
        video.removeEventListener('pause', updatePlayingState);
        video.removeEventListener('ended', () => setIsPlaying(false));
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('volumechange', () => {
            if(videoRef.current) {
                setIsMuted(videoRef.current.muted);
                setVolume(videoRef.current.muted ? 0 : videoRef.current.volume);
            }
          });
      };
    }
  }, [initialMuted]);

  useEffect(() => {
    const checkFullScreen = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', checkFullScreen);
    return () => document.removeEventListener('fullscreenchange', checkFullScreen);
  }, []);


  const hideControls = () => {
    if (isPlaying && !isFullScreen) { // Only hide if playing and not in persistent controls mode like fullscreen
        setShowControls(false);
    }
  };

  const showAndAutoHideControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide controls after 3 seconds of inactivity
    }
  };

  useEffect(() => {
    const playerElement = videoRef.current?.parentElement; // The container for video and controls
    if (playerElement) {
        playerElement.addEventListener('mousemove', showAndAutoHideControls);
        playerElement.addEventListener('mouseleave', hideControls); // Hide when mouse leaves player
    }

    // Clear timeout on unmount or when isPlaying changes
    return () => {
        if (playerElement) {
            playerElement.removeEventListener('mousemove', showAndAutoHideControls);
            playerElement.removeEventListener('mouseleave', hideControls);
        }
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    };
  }, [isPlaying, showAndAutoHideControls]); // Rerun if isPlaying changes to manage timeout correctly

  // Persistently show controls when paused or when explicitly set (e.g. on first load or mouse enter)
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying]);


  return (
    <div
      className={`relative group ${className} bg-black`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={showAndAutoHideControls} // Show controls when mouse enters the player area
      onMouseLeave={() => { // Hide controls when mouse leaves if video is playing
        if (isPlaying && controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) setShowControls(false);
      }}
      onMouseMove={showAndAutoHideControls} // Keep controls visible while mouse is moving over player
    >
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onClick={handlePlayPause}
        onDoubleClick={toggleFullScreen}
        loop={loop}
        playsInline // Important for iOS
        preload="metadata"
      />

      <div
        className={`absolute bottom-0 left-0 right-0 p-2.5 bg-black bg-opacity-60 text-white transition-opacity duration-300 ease-in-out ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1.5 bg-gray-500 hover:h-2.5 cursor-pointer rounded mb-2"
          onClick={handleProgressClick}
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#d4a5a5] rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <div
            className="absolute top-1/2 left-0 h-3 w-3 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 shadow"
            style={{ left: `${(currentTime / duration) * 100}%`, display: duration > 0 ? 'block' : 'none' }}
           />
        </div>

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <button onClick={handlePlayPause} className="focus:outline-none">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex items-center">
              <button onClick={toggleMute} className="focus:outline-none mr-1.5">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 accent-[#d4a5a5] cursor-pointer"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>
            <div className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Add other controls here like quality settings if needed */}
            <button onClick={toggleFullScreen} className="focus:outline-none">
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;