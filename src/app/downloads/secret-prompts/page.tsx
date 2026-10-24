'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PromptItem {
  id: string;
  category: 'youtube-real' | 'video-tool' | 'general';
  title: string;
  subtitle?: string;
  youtubeUrl?: string;
  file: string;
  emoji: string;
  badge: string;
  preview: string;
}

const ALL_PROMPTS: PromptItem[] = [
  // 1. 실제 업로드 영상 프롬프트
  {
    id: 'real-01',
    category: 'youtube-real',
    title: '인생 설명서 어디 있소 | 인생 반품이요',
    subtitle: '조선힙합소리꾼 실제 업로드 영상 제작 프롬프트 원본',
    youtubeUrl: 'https://youtu.be/RuLf3zN8tBo',
    file: '실제영상_01_인생반품이요_제작프롬프트.txt',
    emoji: '🍶',
    badge: '📺 실제 업로드 영상',
    preview: `[미드저니 썸네일]: A weary middle-aged Korean man sitting in a moody, dimly lit vintage Korean pocha, holding a glass of soju with a bittersweet contemplative smile, cinematic lighting, photorealistic, 8k --ar 16:9
[런웨이 비디오]: Slow cinematic camera push-in, the man exhales soft vapor into the cool night air, streetlights softly bokeh in background...
[Suno 음악]: Korean traditional pansori trap, 88 BPM heavy boom-bap rhythm; sorrowful daegeum flute intro leading into gritty 808 bass, acoustic gayageum plucks...
[쇼츠 후킹 대본]: "태어날 때 인생 설명서 받은 사람 있어요? 설명서도 없이 시작해서 반품도 안 되는 내 청춘..."`
  },
  {
    id: 'real-02',
    category: 'youtube-real',
    title: '취업도 안 되고 돈도 없고 | 인생난이도 왜이래',
    subtitle: '조선힙합소리꾼 실제 업로드 영상 제작 프롬프트 원본',
    youtubeUrl: 'https://youtu.be/O9gckpyv5T0',
    file: '실제영상_02_인생난이도왜이래_제작프롬프트.txt',
    emoji: '🔥',
    badge: '📺 실제 업로드 영상',
    preview: `[미드저니 썸네일]: A young Korean job seeker standing on a rooftop overlooking Seoul neon city at twilight, streetwear with traditional dragon embroidery, determined defiant gaze, 8k --ar 16:9
[런웨이 비디오]: Dramatic low-angle camera orbiting around the man, neon signs flickering, cinematic slow motion 60fps...
[Suno 음악]: Hard-hitting Korean hip-hop, 138 BPM energetic trap bounce; aggressive 808 glide bass, intense kkwaenggwari and janggu percussion bursts...
[쇼츠 후킹 대본]: "스펙 쌓고 자격증 따도 왜 내 통장은 0원일까? 인생 난이도 왜 이래! 덤벼봐라 세상아!"`
  },
  {
    id: 'real-03',
    category: 'youtube-real',
    title: '상사 눈치 보일 때 사이다 🤬 해도 지랄',
    subtitle: '조선힙합소리꾼 실제 업로드 영상 제작 프롬프트 원본',
    youtubeUrl: 'https://youtu.be/d7RQ4Zja5U8',
    file: '실제영상_03_상사눈치사이다_해도지랄_제작프롬프트.txt',
    emoji: '🤬',
    badge: '📺 실제 업로드 영상',
    preview: `[미드저니 일러스트]: A dynamic comic-webtoon style digital illustration of a frustrated modern Korean office worker snapping his pen in half with fiery energy, traditional dokkaebi horns glowing, bold pop-art colors --ar 16:9
[Suno 음악]: Fast aggressive Korean punk rap, 145 BPM driving pulse; loud distorted electric guitars, pounding drum kit, piercing taepyeongso horn riffs...
[쇼츠 사이다 훅]: "가만히 있으면 가마니로 보고! 열심히 하면 일만 더 주네?!"`
  },
  {
    id: 'real-04',
    category: 'youtube-real',
    title: '가맥 한잔하자 (전주 서부시장 낭만)',
    subtitle: '조선힙합소리꾼 Suno 공식 등록 명곡 프롬프트 원본',
    youtubeUrl: 'https://suno.com/s/xlUMWiygyRbQJcBW',
    file: '실제영상_04_가맥한잔하자_제작프롬프트.txt',
    emoji: '🍻',
    badge: '⚡ Suno 공식 명곡',
    preview: `[미드저니 썸네일]: A nostalgic, warm, cinematic scene of a traditional Jeonju Gamaek alley at night, glowing retro neon sign, dried pollack grilling over charcoal briquette embers, frosty cold beer glasses clinking together...
[런웨이 비디오]: Slow camera tracking shot along the cozy market alley table, sizzling embers sparkling softly, condensation dripping down cold beer bottle...
[Suno 음악 (1000자 이내)]: Korean traditional fusion, 112 BPM dance-pop bounce; gayageum, haegeum and daegeum weave around janggu, buk, kkwaenggwari, jing, funky bass...`
  },
  {
    id: 'real-05',
    category: 'youtube-real',
    title: '오늘도 참 잘 버텼다 (심야 힐링)',
    subtitle: '조선힙합소리꾼 실제 업로드 영상 제작 프롬프트 원본',
    youtubeUrl: 'https://youtu.be/Odl-2rsJX-8',
    file: '실제영상_05_오늘도참잘버텼다_제작프롬프트.txt',
    emoji: '🌙',
    badge: '📺 실제 업로드 영상',
    preview: `[미드저니 감성 씬]: A solitary figure walking across Mapo Bridge in Seoul at midnight, city lights shimmering on the Han River below, soft rainfall creating glowing puddles, clear umbrella, Studio Ghibli inspired anime aesthetic --ar 16:9
[Suno 음악]: Lo-fi Korean acoustic chill, 75 BPM gentle groove; warm Rhodes electric piano, delicate acoustic guitar fingerpicking, subtle haegeum string whispers, vinyl crackle and rain ambiance...`
  },

  // 2. 영상 제작 실전 툴 프롬프트
  {
    id: 'tool-01',
    category: 'video-tool',
    title: '유튜브 쇼츠 1분 바이럴 대본 생성 프롬프트',
    subtitle: '조회수 터지는 3초 후킹 & 3단 분할 대본 공식',
    file: '실전영상_06_쇼츠_바이럴대본_생성프롬프트.txt',
    emoji: '🎬',
    badge: '🚀 쇼츠 바이럴 치트키',
    preview: `"너는 유튜브 쇼츠 알고리즘을 100% 장악한 조회수 1,000만 크리에이터야.
내가 제시하는 주제: [원하는 주제]
1. 0~3초 후킹: 스크롤을 멈추게 만드는 충격적이거나 공감 100% 질문/선언
2. 본문 전개: 군더더기 없는 핵심 정보 3가지
3. 50~60초 클로징: 댓글 참여 유도 및 구독 유도 멘트
표 형태 컬럼: [시간], [화면 연출 및 이미지 프롬프트], [화면 자막], [AI 성우 나레이션 대본]"`
  },
  {
    id: 'tool-02',
    category: 'video-tool',
    title: 'AI 영상 제작 1급 프롬프트 치트키 가이드북',
    subtitle: '미드저니 8K, 런웨이 Gen-2, TTS 감정조절 공식 총정리',
    file: 'video_prompts_cheat_sheet.html',
    emoji: '📕',
    badge: '📘 공식 비법서',
    preview: `• 미드저니 8K 초고화질 시네마틱 썸네일 프롬프트 모음
• 런웨이(Runway Gen-2/Gen-3) 이미지 ➔ 비디오 변환 모션 프롬프트
• AI 성우(TTS) 숨쉬는 쉼표 및 감정 조절 연출 노하우
• 얼굴 없이 목소리 없이 100만 유튜버가 되는 실전 비법서`
  },

  // 3. 업무 및 창작 실무 프롬프트 모음
  {
    id: 'gen-01',
    category: 'general',
    title: '교육분야 챗GPT 실전 프롬프트 10선',
    file: '01_교육_프롬프트_무료배포.txt',
    emoji: '🎓',
    badge: '💼 실무 프롬프트',
    preview: `강의 커리큘럼 설계, 학습 요약, 학생 질문 대응, 시험 문제 자동 생성 등 교육자 및 강사용 챗GPT 실무 프롬프트 10선.`
  },
  {
    id: 'gen-03',
    category: 'general',
    title: '직장인 업무자동화 100% 프롬프트',
    file: '03_직장인_업무자동화_프롬프트_무료배포.txt',
    emoji: '💼',
    badge: '💼 실무 프롬프트',
    preview: `보고서 3줄 요약, 이메일 정중하게 쓰기, 엑셀 함수/VBA 자동 작성, 회의록 정리용 실무 자동화 프롬프트 모음.`
  },
  {
    id: 'gen-08',
    category: 'general',
    title: '창작 & 스토리텔링 글쓰기 마스터 프롬프트',
    file: '08_창작_글쓰기_프롬프트_무료배포.txt',
    emoji: '🎨',
    badge: '💼 실무 프롬프트',
    preview: `웹소설 플롯 구성, 매력적인 캐릭터 설정, 반전 스토리텔링 기법을 적용한 AI 소설/시나리오 창작 프롬프트.`
  }
];

export default function SecretPromptsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'youtube-real' | 'video-tool' | 'general'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 인증 상태 유지 확인
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
      setErrorMsg('비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredPrompts = activeTab === 'all' 
    ? ALL_PROMPTS 
    : ALL_PROMPTS.filter(p => p.category === activeTab);

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
            미드저니, 런웨이, Suno 프롬프트 원본이 보관되어 있습니다.<br />
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

  // 2. 비밀번호 통과 후 VIP 자료실 화면
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0e',
      color: '#fff',
      padding: '60px 20px 100px',
      fontFamily: "'Noto Sans KR', sans-serif"
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* 상단 헤더 & 일괄 다운로드 버튼 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(212, 175, 55, 0.15) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '24px',
          padding: '36px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#10b981',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 900
              }}>
                🔓 VIP 보안 인증 완료 (비밀번호: 7979)
              </span>
              <span style={{ color: '#ffd700', fontSize: '0.88rem', fontWeight: 700 }}>
                실습 전용 프롬프트 아카이브
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: 0 }}>
              영상 제작용 실전 프롬프트 & 실제 업로드 영상 공유
            </h1>
            <p style={{ color: '#d4d4d8', fontSize: '1rem', marginTop: '10px', maxWidth: '720px', lineHeight: 1.6 }}>
              유튜브 <strong>'조선힙합소리꾼'</strong> 채널 영상 제작에 직접 사용된 미드저니 이미지, 런웨이 영상 모션, Suno 음악 프롬프트, 1분 쇼츠 바이럴 대본 원본을 자유롭게 복사하고 다운로드하여 실습에 활용하세요.
            </p>
          </div>

          {/* 전체 다운로드 액션 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            <a
              href="/downloads/prompts/조선힙합소리꾼_실제영상_프롬프트_전체패키지.zip"
              download="조선힙합소리꾼_실제영상_프롬프트_전체패키지.zip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
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

            <a
              href="/downloads/prompts/조선힙합소리꾼_실제영상_제작프롬프트_전체모음집.txt"
              download="조선힙합소리꾼_실제영상_제작프롬프트_전체모음집.txt"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffd700',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                justifyContent: 'center'
              }}
            >
              📜 [통합본 TXT 한번에 받기]
            </a>
          </div>
        </div>

        {/* 카테고리 필터 탭 */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'all' ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'all' ? '#f43f5e' : 'rgba(255,255,255,0.05)',
              color: '#fff'
            }}
          >
            🔥 전체 프롬프트 ({ALL_PROMPTS.length}종)
          </button>
          <button
            onClick={() => setActiveTab('youtube-real')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'youtube-real' ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'youtube-real' ? '#ffd700' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'youtube-real' ? '#000' : '#fff'
            }}
          >
            📺 실제 업로드 영상 프롬프트 (5종)
          </button>
          <button
            onClick={() => setActiveTab('video-tool')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'video-tool' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'video-tool' ? '#38bdf8' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'video-tool' ? '#000' : '#fff'
            }}
          >
            🚀 쇼츠 & 영상 제작 툴 프롬프트 (2종)
          </button>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'general' ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'general' ? '#a78bfa' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'general' ? '#000' : '#fff'
            }}
          >
            💼 실무 & 글쓰기 프롬프트 (3종)
          </button>
        </div>

        {/* 프롬프트 카드 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'rgba(20, 20, 28, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                position: 'relative',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              {/* 상단 배지 & 유튜브 링크 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  background: p.category === 'youtube-real' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: p.category === 'youtube-real' ? '#ffd700' : '#38bdf8',
                  border: `1px solid ${p.category === 'youtube-real' ? 'rgba(255, 215, 0, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {p.badge}
                </span>

                {p.youtubeUrl && (
                  <a
                    href={p.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#f43f5e',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textDecoration: 'none'
                    }}
                  >
                    ▶ 영상 보러가기 ↗
                  </a>
                )}
              </div>

              {/* 제목 */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{
                  fontSize: '2rem',
                  background: 'rgba(255,255,255,0.06)',
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {p.emoji}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.35 }}>
                    {p.title}
                  </h3>
                  {p.subtitle && (
                    <p style={{ color: '#a1a1aa', fontSize: '0.82rem', margin: '4px 0 0', lineHeight: 1.4 }}>
                      {p.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* 미리보기 박스 */}
              <div style={{
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                color: '#e4e4e7',
                lineHeight: 1.55,
                maxHeight: '140px',
                overflowY: 'auto',
                whiteSpace: 'pre-line',
                marginBottom: '20px'
              }}>
                {p.preview}
              </div>

              {/* 액션 버튼들 */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => copyToClipboard(p.preview, p.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: copiedId === p.id ? '#10b981' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedId === p.id ? '✓ 복사완료!' : '📋 프롬프트 복사'}
                </button>

                <a
                  href={`/downloads/prompts/${p.file}`}
                  download={p.file}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  📥 TXT 다운로드
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 링크 */}
        <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <Link
            href="/"
            style={{
              color: '#ffd700',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 20px',
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
              padding: '10px 20px',
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
