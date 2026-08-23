import CheckoutClient from './CheckoutClient';
import Script from 'next/script';
import Link from 'next/link';

const courses = {
  'course-ai-101': {
    title: '시니어 AI 101 - 챗GPT, 제미나이 완벽 활용법',
    price: 199000,
    desc: '세상에서 가장 똑똑한 2대 AI(챗GPT, 제미나이)를 내 비서처럼 부리는 방법. 일상 대화부터 번역, 문서 요약, 기획까지 쉽고 완벽하게 알려드립니다.',
    image: '/course-ai.png',
    curriculum: [
      '1강: 챗GPT 가입부터 기본 대화법 마스터하기',
      '2강: 챗GPT 실전 활용 - 긴 글 요약의 달인 되기',
      '특별강의: GPT 이미지 생성 완전 마스터',
      '3강: 구글과 찰떡궁합, 제미나이(Gemini) 실전 팁',
      '4강: 상황별 맞춤 AI 선택 가이드',
      '5강: 똑똑하게 질문하는 프롬프트 공식 (기초 편)',
    ],
    reviews: [
      { text: "컴퓨터는 이메일밖에 못하던 제가 이제는 챗GPT로 사업 계획서를 씁니다. 신세계입니다!", author: "김*환 대표님 (62세)" },
      { text: "강의가 너무 쉽게 잘 설명되어 있습니다. 큰 글씨와 시니어 맞춤 설명이 최고네요.", author: "이*숙 원장님 (58세)" }
    ]
  },
  'course-youtube-master': {
    title: 'AI 영상 제작 (복순할매 실습)',
    price: 249000,
    desc: '얼굴 노출 없이, 목소리 녹음 없이! AI를 활용해 고퀄리티 영상 제작과 유튜브 수익화 비법을 알려드립니다.',
    image: '/boksoon_thumb.png',
    curriculum: [
      '1강: 얼굴 없는 유튜브 채널 기획하기',
      '2강: AI로 터지는 대본 5분 만에 뽑아내기',
      '3강: 무료 AI 보이스로 아나운서급 목소리 더하기',
      '4강: 캡컷(CapCut) AI 기능으로 영상 편집 자동화',
      '5강: 유튜브 수익화 전략 및 알고리즘 타는 법',
    ],
    reviews: [
      { text: "얼굴 내놓기 부끄러웠는데, AI가 대신 다 해주니 정말 편합니다. 구독자 1000명 달성했어요!", author: "박*석 님 (65세)" },
      { text: "어렵기만 했던 영상 편집을 클릭 몇 번으로 끝낼 수 있다니 놀랍습니다.", author: "최*영 님 (60세)" }
    ]
  },
  'course-ai-music': {
    title: 'AI 작사/작곡 & 완벽 프롬프트 엔지니어링',
    price: 299000,
    desc: '내가 원하는 대로 척척 알아듣게 만드는 기적의 프롬프트 작성법부터, 나만의 감성이 담긴 음원과 노래를 1분 만에 작곡하는 마법 같은 경험을 제공합니다.',
    image: '/course_ai_music.png',
    curriculum: [
      '1강: 프롬프트 엔지니어링 기초 - AI와 대화하는 법',
      '2강: 내 생각을 음악으로 - AI 작곡 툴 마스터',
      '3강: 나만의 가사 쓰기 - 감성을 자극하는 작사 팁',
      '4강: 새벽의 가야금 실습 - 전통 악기와 AI의 만남',
      '5강: 앨범 발매 및 저작권 등록 A to Z',
    ],
    reviews: [
      { text: "음표 하나 볼 줄 몰랐던 제가 일주일 만에 손주에게 들려줄 동요를 만들었습니다. 감격스럽네요.", author: "정*희 님 (68세)" },
      { text: "프롬프트 하나 바꿨을 뿐인데 퀄리티가 확 달라집니다. 너무 재밌어서 밤새는 줄 몰랐어요.", author: "강*수 님 (59세)" }
    ]
  },
  'course-vibe-coding': {
    title: '[최상위 고급과정] 클로드 & 커서(Cursor)로 완성하는 바이브 코딩',
    price: 399000,
    desc: '코딩을 몰라도, 타이핑을 못해도 괜찮습니다! AI와 대화만으로 나만의 자동화 프로그램과 웹사이트를 뚝딱 만들어내는 최신 바이브 코딩 기법을 시니어 맞춤형으로 전수합니다.',
    image: '/hero-bg.png',
    curriculum: [
      '1강: 바이브 코딩이란? 타이핑 없이 말로 코딩하는 시대',
      '2강: 기적의 에디터 커서(Cursor) 설치 및 기본 세팅',
      '3강: 클로드(Claude)와 커서를 연동하여 나만의 비서 만들기',
      '4강: 실습 1 - 엑셀 정리 자동화 프로그램 5분 만에 뚝딱 만들기',
      '5강: 실습 2 - 우리 가게 홍보용 랜딩 페이지(웹사이트) 말로 만들기'
    ],
    reviews: [
      { text: "은퇴하고 코딩을 배우려다 영어 땜에 포기했었는데, 이 강의 덕분에 말만 하면 프로그램이 뚝딱 나옵니다! 70대인 제가 손주에게 줄 퀴즈 게임을 직접 만들었습니다!", author: "최*식 회장님 (72세)" },
      { text: "이건 정말 미쳤습니다. 우리 공장 재고 관리 프로그램을 업체 안 부르고 제가 직접 만들었네요. 수강료 10배 이상 뽑았습니다.", author: "윤*호 대표님 (65세)" }
    ]
  }
};

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = courses[resolvedParams.id as keyof typeof courses];

  if (!course) {
    return <div style={{ padding: '100px 5%', textAlign: 'center' }}>존재하지 않는 강의입니다.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 5% 100px', maxWidth: '1000px', margin: '0 auto' }}>
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" />
      
      <div style={{ marginBottom: '40px' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '1.125rem' }}>
          ← 전체 강의 목록으로 돌아가기
        </Link>
      </div>
      
      <div className="checkout-grid">
        
        {/* Left Column: Sales Content */}
        <div>
          <img src={course.image} alt={course.title} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)' }} />
          
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.3 }}>
            {course.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '48px' }}>
            {course.desc}
          </p>

          {/* Curriculum */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', color: 'var(--accent-primary)' }}>📚 상세 커리큘럼</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {course.curriculum.map((item, idx) => (
                <li key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '1.125rem', borderLeft: '4px solid var(--accent-primary)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px', color: 'var(--accent-primary)' }}>⭐ 수강생 생생 후기</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {course.reviews.map((review, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                  <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                    "{review.text}"
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>- {review.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Checkout Panel */}
        <div className="glass-panel" style={{ padding: '40px', position: 'sticky', top: '120px' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: '32px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
            수강 신청 결제
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 500 }}>총 결제 금액</span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent-primary)' }}>₩ {course.price.toLocaleString()}</span>
          </div>

          <CheckoutClient courseId={resolvedParams.id} price={course.price} courseTitle={course.title} />

          <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>🔒 안심 결제 보장</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              결제 후 7일 이내 수강 이력이 없을 경우 100% 전액 환불을 보장합니다. 카카오페이/토스페이를 통한 안전한 결제가 지원됩니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
