'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import videoPromptsData from '@/data/video_prompts.json';

interface VideoPromptItem {
  id: string;
  title: string;
  category: string;
  badgeColor?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  imageUrl?: string;
  promptKo: string;
  promptEn?: string;
  txtFileKo?: string;
  txtFileEn?: string;
  desc?: string;
  createdAt?: string;
}

export default function SecretPromptsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptLangMode, setPromptLangMode] = useState<{ [id: string]: 'ko' | 'en' | 'both' }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const prompts: VideoPromptItem[] = (videoPromptsData as VideoPromptItem[]) || [];

  useEffect(() => {
    // 세션 스토리지에서 비밀번호 인증 상태 유지 확인
    const authed = sessionStorage.getItem('secret_prompts_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '7979') {
      setIsAuthenticated(true);
      sessionStorage.setItem('secret_prompts_authed', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다. (비밀번호: 7979)');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const downloadTextFile = (filename: string, content: string) => {
    if (!content) return;
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const downloadImageFile = async (filename: string, imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const categories = Array.from(new Set(['all', ...prompts.map(p => p.category || '기타')]));

  const filteredPrompts = activeTab === 'all'
    ? prompts
    : prompts.filter(p => (p.category || '기타') === activeTab);

  // 1. 비밀번호 잠금 화면
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0e',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(244, 63, 94, 0.15) 0%, rgba(10, 10, 14, 0.98) 70%)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(20, 20, 28, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f43f5e, #ffd700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            margin: '0 auto 24px',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.4)'
          }}>
            🔒
          </div>

          <span style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid #f43f5e',
            color: '#f43f5e',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            VIP 실습 전용 보안 자료실
          </span>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3 }}>
            영상 제작 & 실제 업로드 영상<br />
            <span style={{ color: '#ffd700' }}>프롬프트 파일 공유 자료실</span>
          </h1>

          <p style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
            유튜브 <strong>'조선힙합소리꾼'</strong> 채널에 실제 업로드된 영상의<br />
            미드저니 이미지, 런웨이 영상, Suno 프롬프트 및 TXT 원본이 보관되어 있습니다.<br />
            <strong style={{ color: '#fff' }}>비밀번호 4자리</strong>를 입력하시면 즉시 열람 및 다운로드됩니다.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="password"
                maxLength={8}
                placeholder="비밀번호 4자리 입력"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: '#121218',
                  border: errorMsg ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  letterSpacing: '6px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{ color: '#f87171', fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #d4af37 100%)',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              🔓 실습자료실 입장하기
            </button>
          </form>

          <div style={{ marginTop: '28px' }}>
            <Link href="/" style={{ color: '#71717a', fontSize: '0.88rem', textDecoration: 'underline' }}>
              ← 메인 홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. 비밀번호 통과 후 VIP 실습자료실 화면
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0e',
      color: '#fff',
      padding: '60px 20px 100px',
      fontFamily: "'Noto Sans KR', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 상단 헤더 & 일괄 다운로드 배너 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(212, 175, 55, 0.15) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#10b981',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 900
              }}>
                🔓 VIP 보안 인증 완료 (비밀번호: 7979)
              </span>
              <span style={{ color: '#ffd700', fontSize: '0.88rem', fontWeight: 700 }}>
                실제 영상 프롬프트 & 이미지 아카이브
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: 0 }}>
              영상 제작 실습자료실 (실제 업로드 영상 프롬프트 & 이미지)
            </h1>
            <p style={{ color: '#d4d4d8', fontSize: '1rem', marginTop: '10px', maxWidth: '750px', lineHeight: 1.6 }}>
              유튜브 <strong>'조선힙합소리꾼'</strong> 채널 영상 제작에 실제로 쓰인 이미지 원본, 영상 링크, <strong>한글/영문 2가지 버전의 프롬프트(TXT)</strong>를 자유롭게 열람하고 다운로드하세요.
            </p>
          </div>

          {/* 전체 다운로드 버튼 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            <a
              href="/downloads/prompts/조선힙합소리꾼_실제영상_프롬프트_전체패키지.zip"
              download="조선힙합소리꾼_실제영상_프롬프트_전체패키지.zip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 26px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)'
              }}
            >
              📦 [전체 패키지 일괄 다운로드 (ZIP)]
            </a>
          </div>
        </div>

        {/* 카테고리 필터 탭 */}
        {categories.length > 2 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: activeTab === cat ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                  background: activeTab === cat ? '#ffd700' : 'rgba(255,255,255,0.05)',
                  color: activeTab === cat ? '#000' : '#fff',
                  transition: 'all 0.2s'
                }}
              >
                {cat === 'all' ? `🔥 전체 자료 (${prompts.length}개)` : cat}
              </button>
            ))}
          </div>
        )}

        {/* 빈 목록 안내 (사용자가 관리기에서 등록 전일 때) */}
        {prompts.length === 0 ? (
          <div style={{
            background: 'rgba(20, 20, 28, 0.9)',
            border: '2px dashed rgba(212, 175, 55, 0.4)',
            borderRadius: '24px',
            padding: '60px 30px',
            textAlign: 'center',
            margin: '40px 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffd700', marginBottom: '12px' }}>
              현재 등록 대기 중인 실습 자료실입니다
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 24px' }}>
              바탕화면의 <strong>[조선힙합소리꾼 홈페이지 자동 관리기]</strong>의<br />
              <strong>'🎬 5. 영상 제작 실습자료실 관리'</strong> 탭에서 사장님의 실제 영상 링크, 이미지, 프롬프트(TXT)를 입력하시면 이곳에 실시간으로 등록됩니다!
            </p>
            <div style={{ display: 'inline-flex', gap: '12px' }}>
              <Link href="/" style={{ color: '#fff', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
                ← 메인 홈으로 가기
              </Link>
            </div>
          </div>
        ) : (
          /* 프롬프트 카드 그리드 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {filteredPrompts.map((item) => {
              const langMode = promptLangMode[item.id] || 'both';

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(20, 20, 28, 0.95)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}
                >
                  {/* 상단 카드 헤더 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '20px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: item.badgeColor || '#f43f5e',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          padding: '4px 14px',
                          borderRadius: '999px'
                        }}>
                          {item.category || '실제 업로드 영상'}
                        </span>
                        {item.createdAt && (
                          <span style={{ color: '#71717a', fontSize: '0.82rem' }}>
                            등록일: {item.createdAt}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
                        {item.title}
                      </h3>

                      {item.desc && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: '8px 0 0', lineHeight: 1.5 }}>
                          {item.desc}
                        </p>
                      )}
                    </div>

                    {/* 유튜브 영상 바로보기 */}
                    {item.youtubeUrl && (
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 22px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          textDecoration: 'none',
                          boxShadow: '0 6px 18px rgba(255, 0, 0, 0.4)'
                        }}
                      >
                        ▶️ 실제 유튜브 영상 보기 ↗
                      </a>
                    )}
                  </div>

                  {/* 미디어 영역 (이미지 + 영상 플레이어) */}
                  <div style={{ display: 'grid', gridTemplateColumns: item.imageUrl && item.youtubeId ? '1fr 1fr' : '1fr', gap: '20px' }}>
                    {/* 이미지 */}
                    {item.imageUrl && (
                      <div style={{
                        background: '#0c0c12',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.15)',
                        position: 'relative'
                      }}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          onClick={() => setPreviewImage(item.imageUrl || null)}
                          style={{
                            width: '100%',
                            height: '240px',
                            objectFit: 'cover',
                            display: 'block',
                            cursor: 'zoom-in'
                          }}
                        />
                        <div style={{
                          padding: '10px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'rgba(12, 12, 18, 0.9)'
                        }}>
                          <span style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 700 }}>
                            🖼️ 실제 영상 씬 / 썸네일 이미지
                          </span>
                          <button
                            onClick={() => downloadImageFile(`${item.title || '영상'}_이미지.jpg`, item.imageUrl || '')}
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            📥 이미지 원본 다운로드
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 유튜브 임베드 (있을 경우) */}
                    {item.youtubeId && (
                      <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.15)',
                        height: '280px',
                        background: '#000'
                      }}>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${item.youtubeId}`}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  {/* 프롬프트 영역 (한글 & 영문 2가지 보기 모드) */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '14px'
                    }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffd700' }}>
                        ⚡ 영상 제작 실전 프롬프트 (한글 + 영문 번역)
                      </span>

                      {/* 언어 전환 버튼 */}
                      <div style={{
                        display: 'inline-flex',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '4px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}>
                        <button
                          onClick={() => setPromptLangMode({ ...promptLangMode, [item.id]: 'both' })}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            background: langMode === 'both' ? '#f43f5e' : 'transparent',
                            color: '#fff'
                          }}
                        >
                          한글 + 영문 나란히
                        </button>
                        <button
                          onClick={() => setPromptLangMode({ ...promptLangMode, [item.id]: 'ko' })}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            background: langMode === 'ko' ? '#ffd700' : 'transparent',
                            color: langMode === 'ko' ? '#000' : '#fff'
                          }}
                        >
                          🇰🇷 한글만
                        </button>
                        <button
                          onClick={() => setPromptLangMode({ ...promptLangMode, [item.id]: 'en' })}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            background: langMode === 'en' ? '#38bdf8' : 'transparent',
                            color: langMode === 'en' ? '#000' : '#fff'
                          }}
                        >
                          🇺🇸 영문만
                        </button>
                      </div>
                    </div>

                    {/* 프롬프트 박스 그리드 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: langMode === 'both' ? '1fr 1fr' : '1fr',
                      gap: '16px'
                    }}>
                      {/* 한글 프롬프트 */}
                      {(langMode === 'both' || langMode === 'ko') && (
                        <div style={{
                          background: '#0d0d14',
                          border: '1px solid rgba(255, 215, 0, 0.4)',
                          borderRadius: '16px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ color: '#ffd700', fontWeight: 900, fontSize: '0.95rem' }}>
                              🇰🇷 실전 한글 프롬프트 (작업 원본)
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => copyToClipboard(item.promptKo, `${item.id}-ko`)}
                                style={{
                                  background: copiedId === `${item.id}-ko` ? '#10b981' : 'rgba(255,255,255,0.1)',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                {copiedId === `${item.id}-ko` ? '✓ 복사완료' : '📋 한글 복사'}
                              </button>
                              {item.promptKo && (
                                <button
                                  onClick={() => downloadTextFile(`${item.title || '영상'}_한글_프롬프트.txt`, item.promptKo)}
                                  style={{
                                    background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
                                    color: '#000',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 900,
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  📥 한글 TXT 다운로드
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{
                            background: '#14141e',
                            borderRadius: '12px',
                            padding: '16px',
                            color: '#fef08a',
                            fontSize: '0.92rem',
                            lineHeight: 1.6,
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-line',
                            maxHeight: '260px',
                            overflowY: 'auto'
                          }}>
                            {item.promptKo}
                          </div>
                        </div>
                      )}

                      {/* 영문 프롬프트 (번역본) */}
                      {(langMode === 'both' || langMode === 'en') && (
                        <div style={{
                          background: '#0d0d14',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: '16px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: '0.95rem' }}>
                              🇺🇸 영문 프롬프트 (미드저니/런웨이/Suno 글로벌 입력용)
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => copyToClipboard(item.promptEn || '', `${item.id}-en`)}
                                style={{
                                  background: copiedId === `${item.id}-en` ? '#10b981' : 'rgba(255,255,255,0.1)',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                {copiedId === `${item.id}-en` ? '✓ 복사완료' : '📋 영문 복사'}
                              </button>
                              {item.promptEn && (
                                <button
                                  onClick={() => downloadTextFile(`${item.title || '영상'}_영문_프롬프트.txt`, item.promptEn || '')}
                                  style={{
                                    background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 900,
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  📥 영문 TXT 다운로드
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{
                            background: '#14141e',
                            borderRadius: '12px',
                            padding: '16px',
                            color: '#bae6fd',
                            fontSize: '0.88rem',
                            lineHeight: 1.6,
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-line',
                            maxHeight: '260px',
                            overflowY: 'auto'
                          }}>
                            {item.promptEn || '(영문 번역 프롬프트가 등록되지 않았습니다.)'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 이미지 확대 모달 */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              cursor: 'zoom-out',
              padding: '20px'
            }}
          >
            <img
              src={previewImage}
              alt="확대 미리보기"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
              }}
            />
          </div>
        )}

        {/* 하단 내비게이션 */}
        <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link
            href="/"
            style={{
              color: '#ffd700',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '12px 24px',
              borderRadius: '999px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)'
            }}
          >
            ← 메인 홈페이지로 이동
          </Link>
          <Link
            href="/dashboard"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '12px 24px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            🎓 내 강의실로 이동
          </Link>
        </div>

      </div>
    </div>
  );
}
