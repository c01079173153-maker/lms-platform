'use client';

import { useEffect, useRef, useState } from 'react';
import songsData from '../data/songs.json';

export interface SongItem {
  id: string;
  videoId: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  badgeColor: string;
  desc: string;
  youtubeUrl: string;
  mp3Src?: string;
}

const INITIAL_SONGS: SongItem[] = (songsData as SongItem[]) || [];

const CHANNEL_URL = 'https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC';
const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLar4-ZPn22bA';

const CATEGORIES = [
  { key: 'all', label: '🔥 전체 보기' },
  { key: 'comfort', label: '😭 눈물·인생 위로곡' },
  { key: 'cider', label: '🤬 속시원한 사이다곡' },
  { key: 'parents', label: '🙇 부모님·가족 효도곡' },
  { key: 'work', label: '💼 직장인·퇴근길 공감곡' },
  { key: 'healing', label: '🌙 새벽 감성·힐링곡' },
  { key: 'gugak', label: '🥁 국악·사자후 힙합' },
  { key: 'hope', label: '🌅 희망·응원·역전곡' },
  { key: 'playlist', label: '🎶 연속듣기·모음집' },
];

/** 다운로드 버튼이 원천 차단된 전용 스트리밍 오디오 플레이어 */
function ProtectedAudioPlayer({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
  }, [src]);

  const fmt = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setCurrentTime(fmt(cur));
    setDuration(fmt(dur));
    setProgress((cur / dur) * 100);
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        background: 'rgba(212, 175, 55, 0.1)',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        marginBottom: '20px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          fontWeight: 800,
          color: '#fff1b8',
          marginBottom: '10px',
        }}
      >
        <span>🎵 홈페이지 전용 스트리밍 감상 (무단 다운로드 보호됨)</span>
        <span style={{ color: '#d4af37', fontSize: '0.85rem' }}>
          {currentTime} / {duration}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={src}
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onTimeUpdate}
        onEnded={() => setPlaying(false)}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={toggle}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            background: playing ? '#ff0033' : '#d4af37',
            color: playing ? '#fff' : '#000',
            fontWeight: 900,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          {playing ? '⏸ 일시정지' : '▶ 원곡 듣기'}
        </button>

        <div
          onClick={onSeek}
          style={{
            flex: 1,
            height: '10px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '999px',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
          }}
          title={title}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #d4af37 0%, #ff0033 100%)',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function JoseonHipHopShowcase() {
  const [songs, setSongs] = useState<SongItem[]>(INITIAL_SONGS);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(
    INITIAL_SONGS[0] || null
  );
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetch(
      `https://api.github.com/repos/c01079173153-maker/lms-platform/contents/src/data/songs.json?t=${Date.now()}`,
      {
        headers: { Accept: 'application/vnd.github.v3.raw' },
        cache: 'no-store',
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((liveSongs: SongItem[] | null) => {
        if (Array.isArray(liveSongs)) {
          setSongs(liveSongs);
          setSelectedSong(liveSongs[0] || null);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSongs =
    activeTab === 'all' ? songs : songs.filter((s) => s.category === activeTab);

  return (
    <section
      id="sorikkun-channel"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        padding: '80px 5%',
        background:
          'radial-gradient(circle at 20% 10%, rgba(212, 175, 55, 0.16) 0%, rgba(239, 68, 68, 0.08) 40%, rgba(10, 10, 12, 1) 85%)',
        borderTop: '2px solid rgba(212, 175, 55, 0.35)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.35)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* 상단 채널 소개 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: songs.length > 0 ? '48px' : '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 24px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #ff0033 0%, #d4af37 100%)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.05rem',
              marginBottom: '20px',
              boxShadow: '0 8px 25px rgba(255, 0, 51, 0.4)',
            }}
          >
            👑 OFFICIAL YOUTUBE ARTIST CHANNEL
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              marginBottom: '20px',
              letterSpacing: '-1px',
            }}
          >
            가슴으로 울고 웃는 한(恨)과 흥의 소리, <br />
            <span className="text-gradient">‘조선힙합소리꾼’ 공식 채널관</span>
          </h2>

          <p
            style={{
              fontSize: '1.25rem',
              color: '#d4d4d8',
              maxWidth: '880px',
              margin: '0 auto 32px',
              lineHeight: 1.7,
            }}
          >
            한국적인 전통의 울림(가야금·해금·판소리 사자후)과 현대적인 힙합·발라드가 만나,
            <br />
            <strong>누구에게도 말 못 한 삶의 서러움, 위로, 그리고 속 시원한 사이다</strong>를 노래합니다.
          </p>

          {/* 공식 아트 배너 */}
          <div
            style={{
              maxWidth: '920px',
              margin: '0 auto 36px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 16px 50px rgba(0, 0, 0, 0.7)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
            }}
          >
            <img
              src="/sorikkun/joseon-hiphop-banner.jpg"
              alt="조선힙합소리꾼 (판소리 x 힙합 x 코미디)"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* 채널 직행 빅 버튼 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 36px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff0033 0%, #cc0000 100%)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: '0 10px 30px rgba(255, 0, 51, 0.45)',
                border: '2px solid rgba(255,255,255,0.25)',
              }}
            >
              📺 ‘조선힙합소리꾼’ 유튜브 홈 바로가기 ↗
            </a>

            <a
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 36px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #d4af37 0%, #b58d19 100%)',
                color: '#000',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
              }}
            >
              🎧 명곡 전곡 연속듣기 재생목록 ↗
            </a>
          </div>
        </div>

        {/* 곡이 1개 이상 있을 때만 플레이어 & 곡 선택 리스트 표시 */}
        {songs.length > 0 && selectedSong && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* 왼쪽: 선택된 곡 유튜브 뮤직비디오 즉시 감상 & 바로가기 */}
            <div
              style={{
                background: 'rgba(20, 20, 26, 0.95)',
                borderRadius: '24px',
                padding: '28px',
                border: '2px solid #d4af37',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    background: selectedSong.badgeColor || '#ff3b30',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedSong.badge}
                </span>
                <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.95rem' }}>
                  ✨ 오른쪽 목록에서 곡을 선택해 보세요
                </span>
              </div>

              {/* 유튜브 임베드 플레이어 */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <iframe
                  key={selectedSong.videoId}
                  src={`https://www.youtube.com/embed/${selectedSong.videoId}?rel=0`}
                  title={selectedSong.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  marginBottom: '8px',
                  color: '#fff',
                }}
              >
                {selectedSong.title}
              </h3>
              <p
                style={{
                  fontSize: '1.08rem',
                  color: '#d4af37',
                  fontWeight: 700,
                  marginBottom: '12px',
                }}
              >
                {selectedSong.subtitle}
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#a1a1aa',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                {selectedSong.desc}
              </p>

              {/* 다운로드 방지 전용 스트리밍 플레이어 */}
              {selectedSong.mp3Src && (
                <ProtectedAudioPlayer
                  src={selectedSong.mp3Src}
                  title={selectedSong.title}
                />
              )}

              {/* 선택한 영상으로 유튜브 바로 타고 들어가기 버튼 */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={selectedSong.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    textAlign: 'center',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(90deg, #ff0033 0%, #e60023 100%)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 20px rgba(255, 0, 51, 0.35)',
                  }}
                >
                  🚀 이 곡 유튜브에서 크게 보기 &amp; 댓글 소통하기 ↗
                </a>
              </div>
            </div>

            {/* 오른쪽: 곡 선택 카드 리스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 8개 카테고리 필터 탭 */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '4px',
                }}
              >
                {CATEGORIES.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background:
                        activeTab === tab.key
                          ? '#d4af37'
                          : 'rgba(255,255,255,0.06)',
                      color: activeTab === tab.key ? '#000' : '#e4e4e7',
                      border:
                        activeTab === tab.key
                          ? '1px solid #d4af37'
                          : '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {tab.key === 'all' ? `${tab.label} (${songs.length})` : tab.label}
                  </button>
                ))}
              </div>

              {/* 곡 카드 목록 */}
              {filteredSongs.map((song, idx) => {
                const isSelected = selectedSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    style={{
                      cursor: 'pointer',
                      padding: '20px 22px',
                      borderRadius: '18px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(24, 24, 30, 0.95) 100%)'
                        : 'rgba(24, 24, 30, 0.8)',
                      border: isSelected
                        ? '2px solid #d4af37'
                        : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: isSelected
                        ? '0 10px 25px rgba(212, 175, 55, 0.2)'
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: song.badgeColor || '#ff3b30',
                          color: '#fff',
                        }}
                      >
                        {song.badge}
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSong(song);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: isSelected ? '#d4af37' : 'rgba(255,255,255,0.1)',
                            color: isSelected ? '#000' : '#fff',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                          }}
                        >
                          {isSelected ? '▶ 현재 선택됨' : '🎧 여기서 듣기'}
                        </button>

                        <a
                          href={song.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#ff0033',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                          }}
                        >
                          유튜브 이동 ↗
                        </a>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: isSelected ? '#fff1b8' : '#fff',
                      }}
                    >
                      {idx + 1}. {song.title}
                    </div>

                    <div style={{ fontSize: '0.96rem', color: '#a1a1aa' }}>
                      {song.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
