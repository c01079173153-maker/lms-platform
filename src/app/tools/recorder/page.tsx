"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function RecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Check if the user is on a mobile device
    const checkMobile = () => {
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const handleStartRecording = async (useCameraOnly = false) => {
    try {
      let combinedStream: MediaStream;

      if (useCameraOnly) {
        // Mobile fallback: only record camera and mic
        combinedStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      } else {
        // PC: screen and mic
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        combinedStream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...voiceStream.getAudioTracks()
        ]);
        
        // Handle stop sharing from browser UI
        combinedStream.getVideoTracks()[0].onended = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            handleStopRecording();
          }
        };
      }

      const options = { mimeType: 'video/webm; codecs=vp9' };
      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        try {
          // Attempt to use File System Access API if available
          if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
              suggestedName: `강의_녹화본_${new Date().getTime()}.webm`,
              types: [{
                description: 'WebM Video',
                accept: { 'video/webm': ['.webm'] },
              }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            alert("✅ 영상이 원하시는 폴더에 성공적으로 저장되었습니다!");
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.error('저장 중 오류:', err);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVideoUrl(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("녹화를 시작하려면 화면 및 마이크 권한을 허용해야 합니다.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '80px 5%', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '10px', fontWeight: 600 }}>
          ⭐ 시니어 AI 마스터클래스 전용 툴 ⭐
        </h2>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '20px' }}>
          무료 화면 녹화기
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: 1.6 }}>
          복잡한 프로그램 설치 없이, 인터넷 창에서 클릭 두 번이면 화면과 목소리가 녹화됩니다.
        </p>
      </div>

      {isMobile ? (
        <div className="glass-panel" style={{ padding: '40px', backgroundColor: 'rgba(234, 67, 53, 0.1)', border: '1px solid rgba(234, 67, 53, 0.3)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ea4335', marginBottom: '16px' }}>📱 모바일 기기 접속 안내</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            보안 정책상 스마트폰 인터넷 창에서는 전체 화면 녹화가 불가능합니다. <br/>
            대신, <strong>스마트폰 자체 화면 녹화 기능</strong>을 사용하시거나 <strong>카메라 모드</strong>로 전환해 녹화해 보세요!
          </p>
          
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>💡 스마트폰 자체 녹화 꿀팁</h4>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li><strong>삼성 갤럭시:</strong> 화면 위 상단바를 쓸어내려 [화면 녹화] 아이콘 클릭</li>
              <li><strong>아이폰(애플):</strong> 제어센터(우측 상단 쓸어내리기)에서 [◉ 녹화] 버튼 클릭</li>
            </ul>
          </div>

          <button 
            onClick={() => isRecording ? handleStopRecording() : handleStartRecording(true)}
            className="hover-lift"
            style={{
              padding: '16px 40px',
              fontSize: '1.125rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isRecording ? '#95a5a6' : '#ea4335',
              color: '#fff',
              transition: 'all 0.3s'
            }}
          >
            {isRecording ? '⏹ 촬영 중지' : '📸 내 얼굴(셀카) 촬영 시작'}
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 40px', marginTop: '40px' }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
            <button 
              onClick={() => handleStartRecording(false)}
              disabled={isRecording}
              className="hover-lift"
              style={{
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                cursor: isRecording ? 'not-allowed' : 'pointer',
                backgroundColor: isRecording ? '#444' : '#e74c3c',
                color: isRecording ? '#888' : '#fff',
                transition: 'all 0.3s'
              }}
            >
              {isRecording ? '⏺ 화면 녹화 중...' : '🔴 화면 녹화 시작하기'}
            </button>
            <button 
              onClick={handleStopRecording}
              disabled={!isRecording}
              className="hover-lift"
              style={{
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                cursor: !isRecording ? 'not-allowed' : 'pointer',
                backgroundColor: !isRecording ? '#444' : '#3498db',
                color: !isRecording ? '#888' : '#fff',
                transition: 'all 0.3s'
              }}
            >
              ⏹ 녹화 중지 및 저장
            </button>
          </div>

          {videoUrl && (
            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '20px', color: '#fff' }}>미리보기 및 다운로드</h3>
              <video src={videoUrl} controls style={{ width: '100%', maxWidth: '800px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '24px' }} />
              <br />
              <a 
                href={videoUrl} 
                download={`강의_녹화본_${new Date().getTime()}.webm`}
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  backgroundColor: 'var(--accent-success)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                💾 내 컴퓨터에 영상 다운로드
              </a>
            </div>
          )}
        </div>
      )}

      {/* 홍보 배너 */}
      <div style={{ marginTop: '80px', padding: '40px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(22, 22, 26, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff' }}>AI로 당신의 인생 후반전을 바꾸세요.</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.125rem' }}>
          컴맹도 따라 할 수 있는 가장 쉬운 AI 마스터클래스. 지금 바로 확인해보세요.
        </p>
        <Link href="/" style={{ display: 'inline-block', padding: '16px 32px', backgroundColor: 'var(--accent-primary)', color: '#000', fontWeight: 700, borderRadius: '8px' }}>
          🚀 시니어 AI 101 수강하러 가기
        </Link>
      </div>

    </div>
  );
}
