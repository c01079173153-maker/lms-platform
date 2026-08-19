'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import videoStyles from './video.module.css';

export default function HeroVideoClient() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className={videoStyles.heroVideoContainer} onClick={toggleMute}>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className={videoStyles.heroVideo}
      >
        <source src="/promo-video.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>
      
      {isMuted && (
        <div className={videoStyles.unmuteOverlay}>
          🔊 소리 켜기 (Click!)
        </div>
      )}
    </div>
  );
}
