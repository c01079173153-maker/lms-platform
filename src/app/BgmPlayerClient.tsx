'use client';

import { useEffect, useRef, useState } from 'react';

export default function BgmPlayerClient() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false); // UI 노출 여부

  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.2;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsReady(true);
          // 한 번 성공하면 이벤트 리스너 전부 제거
          document.removeEventListener('click', startAudio);
          document.removeEventListener('keydown', startAudio);
          document.removeEventListener('touchstart', startAudio);
        }).catch((e) => {
          console.log("Audio play prevented by browser:", e);
        });
      }
    };

    // 마우스 클릭, 키보드 입력, 터치 등 사용자의 모든 첫 인터랙션 포착
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    document.addEventListener('touchstart', startAudio);

    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
  }, []);

  const toggleBgm = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop />
      
      {/* 항상 버튼을 보여주어 수동으로도 켤 수 있게 함 */}
      <button 
        onClick={toggleBgm}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          background: isPlaying ? 'rgba(212, 175, 55, 0.9)' : 'rgba(10, 10, 12, 0.8)',
          color: isPlaying ? '#000' : '#fff',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '12px 24px',
          borderRadius: '30px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isPlaying ? '🔊 BGM: 켜짐' : '🔇 BGM: 꺼짐 (재생)'}
      </button>
    </>
  );
}
