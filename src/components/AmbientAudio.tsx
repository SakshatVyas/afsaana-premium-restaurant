"use client";

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientAudio({ play }: { play: boolean }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Use a royalty-free ambient restaurant/jazz ambience track from a reliable source
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");
    audio.loop = true;
    audio.volume = 0.15; // Very subtle
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (play && !isMuted && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [play, isMuted]);

  if (!play) return null;

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-6 left-6 z-[90] w-10 h-10 rounded-full border border-gold/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold transition-all duration-300"
      aria-label={isMuted ? "Unmute ambience" : "Mute ambience"}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
