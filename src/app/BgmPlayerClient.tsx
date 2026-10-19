'use client';

import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  {
    title: '나도 사람이다 (평생 남부터 챙겼는데)',
    src: '/sorikkun/nado_saramida.mp3',
    youtubeUrl: 'https://youtu.be/B5aPSbuycM0',
  },
  {
    title: '열심히 살았는데 남는 게 없더라',
    src: '/sorikkun/yeolsimhi.mp3',
    youtubeUrl: 'https://youtu.be/kHw5fVvYw2g',
  },
  {
    title: '인생 설명서 어디 있소 (인생 반품이요)',
    src: '/sorikkun/banpum.mp3',
    youtubeUrl: 'https://youtu.be/RuLf3zN8tBo',
  },
  {
    title: '착하게 살면 호구가 되더라',
    src: '/sorikkun/hogu.mp3',
    youtubeUrl: 'https://youtu.be/KevwDMC0Ey0',
  },
];

export default function BgmPlayerClient() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.35;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            document.removeEventListener('click', startAudio);
            document.removeEventListener('keydown', startAudio);
            document.removeEventListener('touchstart', startAudio);
          })
          .catch(() => {});
      }
    };

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
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.35;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const selectTrack = (idx: number) => {
    setTrackIdx(idx);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.35;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 80);
  };

  const nextTrack = () => {
    const next = (trackIdx + 1) % TRACKS.length;
    selectTrack(next);
  };

  const currentTrack = TRACKS[trackIdx];

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
      />

      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '360px',
        }}
      >
        {expanded && (
          <div
            style={{
              background: 'rgba(14, 14, 18, 0.96)',
              border: '2px solid #d4af37',
              borderRadius: '18px',
              padding: '16px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '8px',
              }}
            >
              <span style={{ fontWeight: 800, color: '#d4af37', fontSize: '0.95rem' }}>
                🎧 조선힙합소리꾼 명곡 선곡표
              </span>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  background: 'transparent',
                  color: '#aaa',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                ✕ 닫기
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TRACKS.map((t, i) => (
                <button
                  key={t.src}
                  onClick={() => selectTrack(i)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background:
                      i === trackIdx
                        ? 'linear-gradient(90deg, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 100%)'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      i === trackIdx
                        ? '1px solid #d4af37'
                        : '1px solid rgba(255,255,255,0.06)',
                    color: i === trackIdx ? '#fff1b8' : '#e4e4e7',
                    fontSize: '0.92rem',
                    fontWeight: i === trackIdx ? 800 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span>
                    {i === trackIdx && isPlaying ? '🔊 ' : '🎵 '}
                    {i + 1}. {t.title}
                  </span>
                </button>
              ))}
            </div>
            <a
              href="https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '12px',
                display: 'block',
                textAlign: 'center',
                padding: '10px',
                borderRadius: '10px',
                background: '#ff0033',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              ▶ 유튜브 ‘조선힙합소리꾼’ 채널 바로가기
            </a>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleBgm}
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #d4af37 0%, #f5d061 100%)'
                : 'rgba(18, 18, 24, 0.92)',
              color: isPlaying ? '#000' : '#fff',
              backdropFilter: 'blur(10px)',
              border: '2px solid #d4af37',
              padding: '12px 20px',
              borderRadius: '30px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{isPlaying ? '🔊 일시정지' : '▶️ 노래 켜기'}</span>
            <span
              style={{
                fontSize: '0.85rem',
                opacity: 0.9,
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              | {currentTrack.title}
            </span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'rgba(18, 18, 24, 0.92)',
              color: '#d4af37',
              border: '2px solid #d4af37',
              padding: '12px 16px',
              borderRadius: '30px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            }}
          >
            🎶 곡 변경 ({trackIdx + 1}/{TRACKS.length})
          </button>
        </div>
      </div>
    </>
  );
}
