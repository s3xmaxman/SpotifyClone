"use client";

import useSound from 'use-sound';
import { useEffect, useState, useRef, useMemo } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import SeekBar from './Seekbar';



interface PlayerContentProps {
  song: Song;
  songUrl: string; 
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl}) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(0.1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const isRepeatingRef = useRef(isRepeating);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
 
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }
  
    if (!isRepeatingRef.current && isShuffling) {
      const randomIndex = Math.floor(Math.random() * player.ids.length);
      return player.setId(player.ids[randomIndex]);
    }
    
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];
  
    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
  
    player.setId(nextSong);
  }
  
  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }
    
    if (!isRepeatingRef.current && isShuffling) {
      const randomIndex = Math.floor(Math.random() * player.ids.length);
      return player.setId(player.ids[randomIndex]);
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (isRepeatingRef.current) {
      if (sound) {
        sound.seek(0); 
        setCurrentTime(0); 
      }
      return;
    }

    player.setId(previousSong);
  }

  const [play, { pause, sound}] = useSound( songUrl, { 
    volume: volume, 
    loop: isRepeating, 
    onplay: () => {
      setIsPlaying(true);
      setIsPlayingSound(true);
    }, 
    onend: () => { 
      setIsPlaying(false);
      if (!isRepeatingRef.current) { 
        onPlayNext(); 
      } else { 
        play() 
      } 
    }, 
    onpause: () => { 
      setIsPlaying(false);
      setIsPlayingSound(false);
    }, 
    format: ['mp3'], 
  });


  useEffect(() => { 
    if (isRepeating && !isPlaying && isPlayingSound) { 
      sound?.play(); 
    } 
  }, [isRepeating, isPlaying, sound, isPlayingSound]);


  useEffect(() => {
    isRepeatingRef.current = isRepeating;
  }, [isRepeating]);
  
  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    }
  }, [sound]);

  useEffect(() => {
    if (sound) {
      setDuration(sound.duration());
      const interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sound]);


  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [songUrl]);

  useEffect(() => {
    if (sound) {
      setCurrentTime(sound.seek());
    }
  }, [sound]);
  
  useEffect(() => {
    if (sound?._duration) {
      setDuration(sound._duration);
    }
  }, [sound?._duration]);
  

    const handlePlay = () => {
    if (!isPlaying) {
      play();
      } else {
      pause();
    }
  } 
    
  const toggleMute = () => {
      if (volume === 0) {
      setVolume(0.1);
      } else {
      setVolume(0);
      }
  }
  
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };
  
  const formatTime = useMemo(() => {
    return (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  }, []);
  
  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime, sound]);
  const formattedDuration = useMemo(() => formatTime(duration), [duration, sound]);

  const handleSeek = (time: number) => {
    if (sound) {
      sound.seek(time);
      setCurrentTime(time);
    }
  };

    return ( 
      <div className="grid grid-cols-2 md:grid-cols-3 h-full">
          <div className="flex w-full justify-start">
            <div className="flex items-center gap-x-4">
              <MediaItem data={song} />
              <LikeButton songId={song.id} />
            </div>
          </div>

          <div className="flex md:hidden col-auto w-full justify-end items-center">
            <div 
              onClick={handlePlay} 
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer" 
            >
              <Icon size={30} className="text-black" />
            </div>
          </div>
  
          <div className="hidden w-full md:flex md:justify-center items-center max-w-[722px] gap-x-6">
            <FaRandom
              onClick={toggleShuffle}
              size={20}
              className= "text-neutral-400 cursor-pointer hover:text-white transition" 
              style={{color: isShuffling ? 'green' : 'white'}}
            />
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30} 
              className=" text-neutral-400 cursor-pointer hover:text-white transition"
            />
            <div 
              onClick={handlePlay} 
              className="flex items-center justify-center h-7 w-7 rounded-full bg-white p-1 cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={30} 
              className=" text-neutral-400 cursor-pointer hover:text-white transition" 
            />
          <BsRepeat1
            onClick={toggleRepeat}
            size={20}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            style={{color: isRepeating ? 'green' : 'white'}}
          />
            <span className="w-[50px] text-center inline-block">{formattedCurrentTime}</span>
             <SeekBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />
            <span className="w-[50px] text-center inline-block">{formattedDuration}</span>
          </div>
          <div className="hidden md:flex w-full justify-end pr-2">
            <div className="flex items-center gap-x-2 w-[120px]">
              <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34} />
              <Slider value={volume} onChange={(value) => setVolume(value)} />
            </div>
          </div>
        </div>
     );
}
 
export default PlayerContent;


