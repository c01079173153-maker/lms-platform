'use client';

import { useState } from 'react';

// PortOne V2 SDK Type (Simple Mock)
declare global {
  interface Window {
    PortOne: any;
  }
}

interface Props {
  courseId: string;
  price: number;
  courseTitle: string;
}

export default function CheckoutClient({ courseId, price, courseTitle }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPayment = async (channelKey: string, providerName: string) => {
    if (typeof window === 'undefined' || !window.PortOne) {
      setError('결제 모듈을 불러오고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentId = `payment-${crypto.randomUUID()}`;

      // 포트원 V2 SDK 결제 요청
      const response = await window.PortOne.requestPayment({
        // Store ID (Test) - 실제로 포트원 관리자 페이지에서 발급받은 ID 사용 필요
        storeId: 'store-42b785fc-3e6e-4172-8ee4-2a6c382f643f', 
        channelKey: channelKey, // 예: 카카오페이 채널 키
        paymentId: paymentId,
        orderName: courseTitle,
        totalAmount: price,
        currency: 'CURRENCY_KRW',
        payMethod: 'EASY_PAY',
        customer: {
          fullName: '홍길동',
          phoneNumber: '010-1234-5678',
          email: 'test@example.com',
        },
      });

      if (response.code != null) {
        // 오류 발생
        setError(`결제 실패: ${response.message}`);
        setIsProcessing(false);
        return;
      }

      // 결제 성공 (Client-side)
      // 백엔드로 결제 검증 요청
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: response.paymentId, courseId }),
      });

      if (verifyRes.ok) {
        window.location.href = `/dashboard?success=true`;
      } else {
        setError('결제는 완료되었으나 내부 시스템 검증에 실패했습니다. 관리자에게 문의해주세요.');
      }
    } catch (e: any) {
      setError(`결제 중 오류가 발생했습니다: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const btnStyle = {
    width: '100%',
    padding: '20px',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    borderRadius: 'var(--radius-sm)',
    marginBottom: '16px',
    transition: 'transform 0.2s, filter 0.2s',
  };

  return (
    <div>
      {error && (
        <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
          {error}
        </div>
      )}
      
      <button 
        disabled={isProcessing}
        onClick={() => requestPayment('channel-key-kakaopay', '카카오페이')}
        style={{
          ...btnStyle,
          backgroundColor: '#FEE500',
          color: '#191919',
          border: 'none',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
        onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
      >
        {isProcessing ? '결제 진행 중...' : '카카오페이로 결제하기'}
      </button>

      <button 
        disabled={isProcessing}
        onClick={() => requestPayment('channel-key-tosspay', '토스페이')}
        style={{
          ...btnStyle,
          backgroundColor: '#3182F6',
          color: '#FFFFFF',
          border: 'none',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
        onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
      >
        토스페이로 결제하기
      </button>

      <button 
        disabled={isProcessing}
        onClick={() => {
          alert('국민은행 1234-56-7890 (예금주: 염상민)으로 입금해 주시면 확인 후 강의 접속 권한이 부여됩니다. 입금 후 카카오톡으로 연락주세요!');
          window.location.href = `/dashboard?success=true&method=bank`;
        }}
        style={{
          ...btnStyle,
          backgroundColor: 'transparent',
          color: 'var(--accent-primary)',
          border: '2px solid var(--accent-primary)',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          marginTop: '8px'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        무통장 입금으로 결제하기
      </button>

      <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        * 보안 결제 모듈을 통해 안전하게 처리됩니다.
      </p>
    </div>
  );
}
