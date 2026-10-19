'use client';

import { useEffect, useRef, useState } from 'react';
import bgmData from '../data/bgm.json';

interface BgmTrack {
  id: string;
  title: string;
  src: string;
  youtubeUrl?: string;
}

const INITIAL_TRACKS: BgmTrack[] = (bgmData.tracks || []) as BgmTrack[];
const INITIAL_DEFAULT_ID: string = bgmData.defaultTrackId || (INITIAL_TRACKS[0]?.id ?? '');

export default function BgmPlayerClient() {
  const [tracks, setTracks] = useState<BgmTrack[]>(INITIAL_TRACKS);
  const [trackIdx, setTrackIdx] = useState<number>(
    Math.max(
      0,
      INITIAL_TRACKS.findIndex((t) => t.id === INITIAL_DEFAULT_ID)
    )
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // 배포 직후에도 1초 만에 최신 선곡표 및 첫 시작 음악 설정을 불러오도록 실시간 동기화
  useEffect(() => {
    fetch(
      `https://api.github.com/repos/c01079173153-maker/lms-platform/contents/src/data/bgm.json?t=${Date.now()}`,
      {
        headers: { Accept: 'application/vnd.github.v3.raw' },
        cache: 'no-store',
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((liveBgm: { defaultTrackId?: string; tracks?: BgmTrack[] } | null) => {
        if (liveBgm && Array.isArray(liveBgm.tracks) && liveBgm.tracks.length > 0) {
          setTracks(liveBgm.tracks);
          const defIdx = liveBgm.tracks.findIndex(
            (t) => t.id === liveBgm.defaultTrackId
          );
          if (defIdx >= 0) {
            setTrackIdx(defIdx);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let started = false;

    const tryPlay = () => {
      if (started || !audioRef.current) return;
      audioRef.current.volume = 0.4;
      audioRef.current
        .play()
        .then(() => {
          started = true;
          setIsPlaying(true);
          cleanup();
        })
        .catch(() => {});
    };

    const events = [
      'click',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'pointermove',
      'mousemove',
    ];

    const cleanup = () => {
      events.forEach((ev) => window.removeEventListener(ev, tryPlay));
    };

    tryPlay();
    events.forEach((ev) => window.addEventListener(ev, tryPlay, { passive: true }));

    return cleanup;
  }, [trackIdx]);

  if (tracks.length === 0) return null;

  const toggleBgm = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const selectTrack = (idx: number) => {
    setTrackIdx(idx);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 80);
  };

  const nextTrack = () => {
    const next = (trackIdx + 1) % tracks.length;
    selectTrack(next);
  };

  const currentTrack = tracks[trackIdx] || tracks[0];

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        autoPlay
        preload="auto"
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
          maxWidth: '370px',
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
              {tracks.map((t, i) => (
                <button
                  key={t.id}
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
            🎶 곡 변경 ({trackIdx + 1}/{tracks.length})
          </button>
        </div>
      </div>
    </>
  );
}
