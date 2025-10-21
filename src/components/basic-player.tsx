import { useState, useRef, useEffect } from 'react';

interface AudioFile {
  url: string;
  title: string;
  excerpt: string;
  duration: string;
}

interface BasicPlayerProps {
  audioFiles: AudioFile[];
}

export default function BasicPlayer({ audioFiles }: BasicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    if (audioRef.current) {
      audioRef.current.src = audioFiles[index].url;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Playback prevented:", error);
        });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentTrack < audioFiles.length - 1) {
        playTrack(currentTrack + 1);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTrack, audioFiles]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">{audioFiles[currentTrack].title}</h2>
        <audio 
          ref={audioRef}
          src={audioFiles[currentTrack].url} 
          controls 
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        {audioFiles.map((file, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              index === currentTrack 
                ? 'bg-blue-500/20 border border-blue-500/50' 
                : 'hover:bg-gray-700/50'
            }`}
            onClick={() => playTrack(index)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{file.title}</h3>
              </div>
              <span className="text-sm text-gray-400 ml-4">{file.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
