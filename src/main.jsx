import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const VIDEO_URL = '/video.mp4';
const END_MESSAGE =
  'If I had to choose my choices all over again in this lifetime, I wouldn\'t change a single thing. I would do it all over again because I got to meet you, I got to love you, I got to be with you. You are my everything and I love you more than anything in this world. Happy Birthday, meri jaanu!';
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
};
const HEARTS = Array.from({ length: 36 }, (_, index) => ({
  left: `${(index * 37 + 8) % 100}%`,
  delay: `${-((index * 1.7) % 18)}s`,
  duration: `${14 + ((index * 7) % 11)}s`,
  size: `${10 + ((index * 5) % 13)}px`,
  drift: `${((index * 19) % 50) - 25}px`,
}));

function App() {
  const [phase, setPhase] = useState('welcome');
  const [popupOpen, setPopupOpen] = useState(false);
  const [videoMissing, setVideoMissing] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const timer = window.setTimeout(() => {
      setPhase('video');
      window.requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => {});
      });
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const openSurprise = () => setPhase('loading');

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seekVideo = (event) => {
    const video = videoRef.current;
    const nextTime = Number(event.target.value);
    if (!video || !Number.isFinite(nextTime)) return;
    video.currentTime = nextTime;
    setVideoTime(nextTime);
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setVideoTime(0);
    video.play().catch(() => {});
  };

  return (
    <main className={`experience experience--${phase}`}>
      <div className="heart-rain" aria-hidden="true">
        {HEARTS.map((heart, index) => (
          <span
            className="heart-rain__heart"
            key={index}
            style={{
              '--heart-left': heart.left,
              '--heart-delay': heart.delay,
              '--heart-duration': heart.duration,
              '--heart-size': heart.size,
              '--heart-drift': heart.drift,
            }}
          >♥</span>
        ))}
      </div>
      {phase === 'welcome' && (
        <section className="welcome" aria-labelledby="welcome-title">
          <article className="invitation">
            <header className="invitation__header">
              <span className="invitation__seal" aria-hidden="true">♥</span>
              <p className="invitation__mark">A little birthday love</p>
            </header>
            <div className="invitation__body">
              <p className="invitation__eyebrow">To my favourite person</p>
              <h1 id="welcome-title"><span>Fanta</span><span>Birthday</span><span>Surprise</span></h1>
            <p className="invitation__copy">
                A little something, gathered<br className="desktop-break" /> with all my love.
            </p>
            </div>
            <button className="open-button" type="button" onClick={openSurprise}>
              <span>Open your surprise</span><span aria-hidden="true">↗</span>
            </button>
            <span className="invitation__footnote">JUST FOR YOU, MERI JAANU</span>
          </article>
        </section>
      )}

      {phase === 'loading' && (
        <section className="loader" aria-label="Opening surprise" aria-live="polite">
          <p>For Meri Jaanu</p>
          <div className="loader__track" aria-hidden="true">
            <span />
          </div>
          <small>Opening your moment</small>
        </section>
      )}

      {phase === 'video' && (
        <section className="video-stage" aria-label="Birthday video">
          <video
            ref={videoRef}
            className={videoMissing ? 'video video--missing' : 'video'}
            src={VIDEO_URL}
            playsInline
            controls={false}
            preload="auto"
            onTimeUpdate={(event) => setVideoTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setVideoDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
            onDurationChange={(event) => setVideoDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => { setVideoPlaying(false); setPopupOpen(true); }}
            onError={() => setVideoMissing(true)}
          />
          {videoMissing && (
            <div className="video-fallback" role="status">
              <p className="video-fallback__name">For Meri Jaanu</p>
              <p>Add <strong>video.mp4</strong> to the public folder.</p>
            </div>
          )}
          {!videoMissing && (
            <div className="video-controls" aria-label="Video controls">
              <button className="video-controls__icon" type="button" onClick={restartVideo} aria-label="Restart video" title="Restart video">
                <span aria-hidden="true">↺</span>
              </button>
              <button className="video-controls__play" type="button" onClick={toggleVideo} aria-label={videoPlaying ? 'Pause video' : 'Play video'}>
                <span aria-hidden="true">{videoPlaying ? 'Ⅱ' : '▶'}</span>
              </button>
              <span className="video-controls__time" aria-label={`Elapsed time ${formatTime(videoTime)}`}>{formatTime(videoTime)}</span>
              <input
                className="video-controls__timeline"
                type="range"
                min="0"
                max={videoDuration || 0}
                step="0.1"
                value={Math.min(videoTime, videoDuration || 0)}
                onChange={seekVideo}
                disabled={!videoDuration}
                aria-label="Video timeline"
                style={{ '--timeline-progress': `${videoDuration ? (videoTime / videoDuration) * 100 : 0}%` }}
              />
              <span className="video-controls__time" aria-label={`Video duration ${formatTime(videoDuration)}`}>{formatTime(videoDuration)}</span>
            </div>
          )}
        </section>
      )}

      {popupOpen && (
        <div className="popup-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPopupOpen(false);
        }}>
          <article className="message-card" role="dialog" aria-modal="true" aria-labelledby="message-title">
            <p className="message-card__mark">For Fanta</p>
            <h2 id="message-title">One last thing</h2>
            <p>{END_MESSAGE}</p>
            <button type="button" onClick={() => setPopupOpen(false)}>Cutiepatootieeeee</button>
          </article>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
