import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaRedo, FaMinus, FaPlus, FaClock } from "react-icons/fa";

const CustomAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const changeVolume = (val) => {
    let newVolume = Math.min(1, Math.max(0, volume + val));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      style={{
        backgroundColor: "#10b981",
        padding: "10px 20px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        color: "white",
        fontWeight: "bold",
        fontSize: "18px",
        width:"500px",
        // justifyContent:"flex-end"
      }}
    >
      <FaClock /> {formatTime(duration - currentTime)}
      <button onClick={togglePlay} style={{ background: "none", border: "none", color: "white" }}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button onClick={resetAudio} style={{ background: "none", border: "none", color: "white" }}>
        <FaRedo />
      </button>
      <button onClick={() => changeVolume(-0.1)} style={{ background: "none", border: "none", color: "white" }}>
        <FaMinus />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
          setVolume(e.target.value);
          audioRef.current.volume = e.target.value;
        }}
      />
      <button onClick={() => changeVolume(0.1)} style={{ background: "none", border: "none", color: "white" }}>
        <FaPlus />
      </button>

      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CustomAudioPlayer;
