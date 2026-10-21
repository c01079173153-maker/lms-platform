'use client';

import { useEffect, useState } from 'react';
import initialPrompts from '../data/suno_prompts.json';

export interface SunoPromptItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeColor?: string;
  sunoUrl: string;
  clipId?: string;
  imageUrl?: string;
  audioUrl?: string;
  stylePromptEn: string;
  stylePromptKo: string;
  desc?: string;
  lyrics: string;
}

const INITIAL_DATA: SunoPromptItem[] = (initialPrompts as SunoPromptItem[]) || [];

export default function SunoPromptHub() {
  const [prompts, setPrompts] = useState<SunoPromptItem[]>(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLyrics, setExpandedLyrics] = useState<{ [id: string]: boolean }>({});
  const [promptViewMode, setPromptViewMode] = useState<{ [id: string]: 'both' | 'en' | 'ko' }>({});

  useEffect(() => {
    fetch(
      `https://api.github.com/repos/c01079173153-maker/lms-platform/contents/src/data/suno_prompts.json?t=${Date.now()}`,
      {
        headers: { Accept: 'application/vnd.github.v3.raw' },
        cache: 'no-store',
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((liveData: SunoPromptItem[] | null) => {
        if (Array.isArray(liveData)) {
          setPrompts(liveData);
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(`${id}-${label}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleLyrics = (id: string) => {
    setExpandedLyrics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setCardMode = (id: string, mode: 'both' | 'en' | 'ko') => {
    setPromptViewMode((prev) => ({ ...prev, [id]: mode }));
  };

  const categories = ['all', ...Array.from(new Set(prompts.map((p) => p.category)))];

  const filteredPrompts =
    activeCategory === 'all'
      ? prompts
      : prompts.filter((p) => p.category === activeCategory);

  return (
    <section
      id="suno-prompts"
      style={{
        padding: '90px 5%',
        background:
          'radial-gradient(circle at 80% 30%, rgba(244, 63, 94, 0.12) 0%, rgba(212, 175, 55, 0.08) 45%, rgba(10, 10, 12, 1) 90%)',
        borderTop: '2px solid rgba(244, 63, 94, 0.3)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #f43f5e 0%, #d4af37 100%)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1rem',
              marginBottom: '18px',
              boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
            }}
          >
            🎵 SUNO AI MUSIC PROMPT &amp; LYRICS HUB
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              marginBottom: '18px',
              letterSpacing: '-1px',
              color: '#fff',
            }}
          >
            누구나 1초 만에 명곡을 만드는 <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #d4af37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Suno AI 프롬프트 &amp; 가사 가이드
            </span>
          </h2>

          <p
            style={{
              fontSize: '1.2rem',
              color: '#d4d4d8',
              maxWidth: '860px',
              margin: '0 auto 28px',
              lineHeight: 1.7,
            }}
          >
            조선힙합소리꾼이 직접 검증한 <strong>Suno 최고 퀄리티 스타일 프롬프트(영어 원문 + 한글 완벽 번역 해설)</strong>와 <strong>파트별 실전 가사</strong>를 무료로 공개합니다. <br />
            클릭 한 번으로 복사하여 Suno에 붙여넣기만 하면 누구나 프로 수준의 음악을 완성할 수 있습니다!
          </p>

          {/* 3단계 이용 가이드 안내 박스 */}
          <div
            style={{
              maxWidth: '980px',
              margin: '0 auto 36px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '16px',
              padding: '24px 28px',
              textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: '#f43f5e',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>
                  영문 프롬프트 복사
                </strong>
                <span style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  원하는 곡의 <strong>[영문 프롬프트 복사]</strong> 버튼을 누르면 Suno 최적화 태그가 복사됩니다.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: '#fb923c',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>
                  Suno Custom에 붙여넣기
                </strong>
                <span style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  <a
                    href="https://suno.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#f43f5e', textDecoration: 'underline', fontWeight: 700 }}
                  >
                    Suno.com
                  </a>
                  에서 <strong>[Custom]</strong> 켜고 <strong>Style of Music</strong>에 붙여넣습니다.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: '#10b981',
                  color: '#000',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block', fontSize: '1.05rem', marginBottom: '4px' }}>
                  가사 넣고 생성(Create)!
                </strong>
                <span style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  <strong>[가사 복사]</strong>를 눌러 Lyrics에 넣거나 직접 쓴 가사를 넣고 <strong>[Create]</strong>를 누르면 완성!
                </span>
              </div>
            </div>
          </div>

          {/* 카테고리 필터 탭 */}
          {categories.length > 2 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '32px',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '999px',
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: activeCategory === cat ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
                    background: activeCategory === cat ? 'linear-gradient(135deg, #f43f5e 0%, #d4af37 100%)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                  }}
                >
                  {cat === 'all' ? '🔥 전체 프롬프트' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 프롬프트 카드 그리드 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {filteredPrompts.map((item) => {
            const mode = promptViewMode[item.id] || 'both';
            const isLyricsOpen = expandedLyrics[item.id] ?? false;

            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(20, 20, 26, 0.9)',
                  border: '2px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '24px',
                  padding: '36px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* 상단 카드 헤더 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '20px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: item.badgeColor || '#f43f5e',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          padding: '4px 14px',
                          borderRadius: '999px',
                        }}
                      >
                        {item.badge}
                      </span>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#e4e4e7',
                          fontSize: '0.85rem',
                          padding: '4px 12px',
                          borderRadius: '999px',
                        }}
                      >
                        카테고리: {item.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
                      {item.title}
                    </h3>

                    {item.desc && (
                      <p style={{ color: '#a1a1aa', fontSize: '1rem', marginTop: '8px', lineHeight: 1.5, margin: '8px 0 0' }}>
                        {item.desc}
                      </p>
                    )}
                  </div>

                  {/* Suno 바로가기 링크 */}
                  {item.sunoUrl && (
                    <a
                      href={item.sunoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 22px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                        boxShadow: '0 6px 18px rgba(244, 63, 94, 0.35)',
                      }}
                    >
                      🎧 Suno에서 원곡 듣기 ↗
                    </a>
                  )}
                </div>

                {/* Suno 공식 임베드 플레이어 (clipId가 있거나 URL에서 추출 가능한 경우) */}
                {(() => {
                  const effectiveClipId =
                    item.clipId ||
                    (item.sunoUrl
                      ? (item.sunoUrl.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i) || [])[1]
                      : '');
                  if (!effectiveClipId) return null;
                  return (
                    <div style={{ marginBottom: '28px', borderRadius: '14px', overflow: 'hidden' }}>
                      <iframe
                        width="100%"
                        height="150"
                        src={`https://suno.com/embed/${effectiveClipId}`}
                        title={item.title}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        style={{
                          borderRadius: '14px',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          display: 'block',
                        }}
                      />
                    </div>
                  );
                })()}

                {/* 1. 스타일 프롬프트 섹션 (영어 + 한글 두 가지 나타나게 설정) */}
                <div style={{ marginBottom: '30px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fb923c' }}>
                        ⚡ Suno 스타일 프롬프트 (Style Prompt)
                      </span>
                    </div>

                    {/* 보기 모드 전환 (두 개 나란히 / 영어만 / 한글만) */}
                    <div
                      style={{
                        display: 'inline-flex',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '4px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <button
                        onClick={() => setCardMode(item.id, 'both')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: mode === 'both' ? '#f43f5e' : 'transparent',
                          color: '#fff',
                        }}
                      >
                        영어 + 한글 나란히
                      </button>
                      <button
                        onClick={() => setCardMode(item.id, 'en')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: mode === 'en' ? '#f43f5e' : 'transparent',
                          color: '#fff',
                        }}
                      >
                        🇺🇸 영문 (Suno용)
                      </button>
                      <button
                        onClick={() => setCardMode(item.id, 'ko')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: mode === 'ko' ? '#f43f5e' : 'transparent',
                          color: '#fff',
                        }}
                      >
                        🇰🇷 한글 번역 해설
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: mode === 'both' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
                      gap: '16px',
                    }}
                  >
                    {/* 영문 프롬프트 상자 */}
                    {(mode === 'both' || mode === 'en') && (
                      <div
                        style={{
                          background: 'rgba(10, 10, 15, 0.9)',
                          border: '1px solid rgba(244, 63, 94, 0.4)',
                          borderRadius: '14px',
                          padding: '20px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f43f5e' }}>
                            🇺🇸 영문 스타일 프롬프트 (Suno 입력용)
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.stylePromptEn, item.id, 'promptEn')}
                            style={{
                              background: copiedId === `${item.id}-promptEn` ? '#10b981' : '#f43f5e',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'background 0.2s ease',
                            }}
                          >
                            {copiedId === `${item.id}-promptEn` ? '✓ 복사 완료!' : '📋 영문 복사'}
                          </button>
                        </div>
                        <p
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.95rem',
                            color: '#f1f5f9',
                            lineHeight: 1.6,
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.stylePromptEn}
                        </p>
                      </div>
                    )}

                    {/* 한글 번역 & 해설 상자 */}
                    {(mode === 'both' || mode === 'ko') && (
                      <div
                        style={{
                          background: 'rgba(10, 10, 15, 0.9)',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          borderRadius: '14px',
                          padding: '20px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fbbf24' }}>
                            🇰🇷 한글 번역 &amp; 음악 요소 해설
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.stylePromptKo, item.id, 'promptKo')}
                            style={{
                              background: copiedId === `${item.id}-promptKo` ? '#10b981' : 'rgba(212, 175, 55, 0.25)',
                              color: copiedId === `${item.id}-promptKo` ? '#fff' : '#fff1b8',
                              border: '1px solid rgba(212, 175, 55, 0.5)',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {copiedId === `${item.id}-promptKo` ? '✓ 복사 완료!' : '📋 한글 복사'}
                          </button>
                        </div>
                        <p
                          style={{
                            fontSize: '0.95rem',
                            color: '#e2e8f0',
                            lineHeight: 1.65,
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.stylePromptKo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 가사 섹션 (Lyrics) */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: isLyricsOpen ? '16px' : '0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>
                        🎤 실전 가사 (Lyrics &amp; 구조 태그)
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        [Intro] · [Drop] · [Verse] 포함
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => copyToClipboard(item.lyrics, item.id, 'lyrics')}
                        style={{
                          background: copiedId === `${item.id}-lyrics` ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                      >
                        {copiedId === `${item.id}-lyrics` ? '✓ 가사 복사됨!' : '📋 전체 가사 복사'}
                      </button>

                      <button
                        onClick={() => toggleLyrics(item.id)}
                        style={{
                          background: isLyricsOpen ? 'rgba(244, 63, 94, 0.2)' : 'rgba(212, 175, 55, 0.15)',
                          border: `1px solid ${isLyricsOpen ? '#f43f5e' : '#d4af37'}`,
                          color: isLyricsOpen ? '#f43f5e' : '#fff1b8',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                      >
                        {isLyricsOpen ? '▲ 가사 닫기' : '▼ 가사 전문 보기'}
                      </button>
                    </div>
                  </div>

                  {isLyricsOpen && (
                    <div
                      style={{
                        background: 'rgba(10, 10, 15, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '20px',
                        maxHeight: '380px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        color: '#cbd5e1',
                      }}
                    >
                      {item.lyrics}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
