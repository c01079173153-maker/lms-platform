'use client';

import Link from 'next/link';

interface Props {
  courseId: string;
  price: number;
  courseTitle: string;
}

export default function CheckoutClient({ courseId, courseTitle }: Props) {
  return (
    <div>
      <div
        style={{
          padding: '20px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          color: '#6ee7b7',
          border: '1px solid #10b981',
          borderRadius: '12px',
          marginBottom: '24px',
          fontWeight: 700,
          lineHeight: 1.6,
          textAlign: 'center',
        }}
      >
        🎉 <strong>[전면 무료 개방]</strong>
        <br />
        《{courseTitle}》 과정은 결제 없이 <strong>100% 무료(₩0)</strong>로 즉시 수강하실 수 있습니다!
      </div>

      <Link
        href={`/player/${courseId}`}
        style={{
          display: 'block',
          width: '100%',
          padding: '22px',
          fontSize: '1.35rem',
          fontWeight: 900,
          borderRadius: '12px',
          marginBottom: '16px',
          backgroundColor: '#10b981',
          color: '#000',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
        }}
      >
        🎓 지금 바로 무료 강의실 입장하기
      </Link>

      <a
        href="https://www.youtube.com/@%EC%A1%B0%EC%84%A0%ED%9E%99%ED%95%A9%EC%86%8C%EB%A6%AC%EA%BE%BC"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: '18px',
          fontSize: '1.15rem',
          fontWeight: 800,
          borderRadius: '12px',
          backgroundColor: '#ff0033',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        📺 ‘조선힙합소리꾼’ 유튜브 채널 바로가기 ↗
      </a>
    </div>
  );
}
