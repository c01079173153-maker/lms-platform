'use client';

import { useState } from 'react';

interface SongItem {
  id: string;
  videoId: string;
  title: string;
  subtitle: string;
  category: 'all' | 'comfort' | 'cider' | 'playlist';
  badge: string;
  badgeColor: string;
  desc: string;
  youtubeUrl: string;
  mp3Src?: string;
}

const SONGS: SongItem[] = [
  {
    id: 'collection-37m',
    videoId: '9gb3YrrfjyQ',
    title: '🎧 다 포기하고 싶을 때 듣는 위로곡 모음 (37분 연속듣기)',
    subtitle: '지치고 외로운 밤, 아무 생각 없이 틀어놓는 눈물의 힐링 명곡 10선 합본',
    category: 'playlist',
    badge: '🔥 조회수 폭발 인기 모음집',
    badgeColor: '#ff3b30',
    desc: '다들 내가 안 힘든 줄 안다 · 마음에도 계절이 있다 · 해도 지랄 안 해도 지랄 · 월급은 오겠지 · 힘들었겠구나 · 아프지말아라 · 잠시 쉬어가 외 전곡 수록',
    youtubeUrl: 'https://youtu.be/9gb3YrrfjyQ',
  },
  {
    id: 'nado-saramida',
    videoId: 'B5aPSbuycM0',
    title: '🎧 평생 남부터 챙겼는데 😭 나도 사람이다!',
    subtitle: '누구의 부모, 누구의 일꾼이 아닌 내 이름 석 자로 살고 싶었던 당신께',
    category: 'comfort',
    badge: '😭 눈물 주의 대표곡',
    badgeColor: '#f59e0b',
    desc: '새벽부터 허리 굽혀 가족 위해 살아왔는데, 내가 아플 땐 늘 혼자였던 서러움... "참 많이도 애썼다, 이제 나도 행복하자!"',
    youtubeUrl: 'https://youtu.be/B5aPSbuycM0',
    mp3Src: '/sorikkun/nado_saramida.mp3',
  },
  {
    id: 'yeolsimhi',
    videoId: 'kHw5fVvYw2g',
    title: '🎧 열심히 살았는데 남는 게 없더라 | 당신은 참 잘 살아왔소',
    subtitle: '내 청춘 다 주었는데 빈손인 것 같아 서러운 날 듣는 인생 위로곡',
    category: 'comfort',
    badge: '🌿 5060 폭풍 공감',
    badgeColor: '#10b981',
    desc: '다 이루지 못한 인생이라 해도 그대까지 실패한 건 아니오. 세상이 알아주지 못한 그 세월도 그대는 참 잘 살아왔소.',
    youtubeUrl: 'https://youtu.be/kHw5fVvYw2g',
    mp3Src: '/sorikkun/yeolsimhi.mp3',
  },
  {
    id: 'inseng-banpum',
    videoId: 'RuLf3zN8tBo',
    title: '🎧 인생 설명서 어디 있소 | 내 인생 반품이요!',
    subtitle: '웃으라 해서 웃고 참으라 해서 참았는데, 내 속은 누가 값을 쳐 주겠소!',
    category: 'cider',
    badge: '⚡ 사이다 + 공감',
    badgeColor: '#8b5cf6',
    desc: '반품은 못 해도 계약은 끝났소! 남들 눈치 보며 빌려 산 인생, 남은 인생만큼은 내 뜻대로 살겠소. 인생아 다음 장은 내가 쓴다!',
    youtubeUrl: 'https://youtu.be/RuLf3zN8tBo',
    mp3Src: '/sorikkun/banpum.mp3',
  },
  {
    id: 'hogu',
    videoId: 'KevwDMC0Ey0',
    title: '🎧 착하게 살면 호구가 되더라 🤬 이제는 절대 안 참는다',
    subtitle: '좋은 게 좋은 거라 평생을 양보했더니 만만하게 보던 세상에 날리는 사자후',
    category: 'cider',
    badge: '🤬 속시원한 사이다',
    badgeColor: '#ef4444',
    desc: '내가 힘들 땐 다들 바쁘다더니 자기 아쉬우면 나를 찾더라! 도울 사람 돕고 아닌 사람 떠나보내, 내 인생은 내가 주인이다!',
    youtubeUrl: 'https://youtu.be/KevwDMC0Ey0',
    mp3Src: '/sorikkun/hogu.mp3',
  },
  {
    id: 'wae-naman',
    videoId: 'pq4nkDCOPtY',
    title: '🎧 내가 제일 만만했더라 🤬 왜 나만 참아야 해',
    subtitle: '착한 사람이 되는 게 이렇게 아픈 거라면, 오늘만큼은 나부터 챙기겠다',
    category: 'cider',
    badge: '🔥 직장인·인간관계 필청',
    badgeColor: '#ec4899',
    desc: '좋은 사람이고 싶어서 싫은 소리 한 번 못 했는데 돌아보니 내가 제일 만만했더라. 나를 아프게 하는 것들과 조금씩 멀어지겠다!',
    youtubeUrl: 'https://youtu.be/pq4nkDCOPtY',
  },
];

const CHANNEL_URL = 'https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC';
const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLar4-ZPn22bA';

export default function JoseonHipHopShowcase() {
  const [selectedSong, setSelectedSong] = useState<SongItem>(SONGS[1]); // 기본: 나도 사람이다
  const [activeTab, setActiveTab] = useState<'all' | 'comfort' | 'cider' | 'playlist'>('all');

  const filteredSongs =
    activeTab === 'all' ? SONGS : SONGS.filter((s) => s.category === activeTab);

  return (
    <section
      id="sorikkun-channel"
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
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            <br />
            아래에서 원하시는 곡을 <strong>직접 선택해 감상</strong>하시거나 <strong>유튜브 채널로 바로 이동</strong>해 보세요!
          </p>

          {/* 채널 직행 빅 버튼 3종 */}
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

        {/* 메인 플레이어 & 선택형 곡 리스트 레이아웃 */}
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
                  background: selectedSong.badgeColor,
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

            {/* 내장 고음질 MP3 미리듣기 바 (있을 경우) */}
            {selectedSong.mp3Src && (
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#fff1b8',
                    marginBottom: '8px',
                  }}
                >
                  🎵 홈페이지에서 고음질 원곡 음원 바로 듣기:
                </div>
                <audio
                  key={selectedSong.mp3Src}
                  controls
                  src={selectedSong.mp3Src}
                  style={{ width: '100%', height: '38px' }}
                />
              </div>
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
                🚀 이 곡 유튜브에서 크게 보기 & 댓글 소통하기 ↗
              </a>
            </div>
          </div>

          {/* 오른쪽: 곡 선택 카드 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 카테고리 탭 */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '4px',
              }}
            >
              {[
                { key: 'all', label: '🔥 전체 명곡 (6)' },
                { key: 'comfort', label: '😭 눈물·인생 위로곡' },
                { key: 'cider', label: '🤬 속시원한 사이다곡' },
                { key: 'playlist', label: '🎶 37분 연속듣기' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
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
                  {tab.label}
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
                        background: song.badgeColor,
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
      </div>
    </section>
  );
}
