import React, { useState, useEffect } from 'react';

const PWAStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Service Worker update detection
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker has taken control
        setUpdateAvailable(false);
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };

  if (!showStatus && !updateAvailable && isOnline) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Connection Status */}
      {showStatus && (
        <div style={{
          backgroundColor: isOnline ? '#4caf50' : '#f44336',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '16px' }}>
            {isOnline ? '🟢' : '🔴'}
          </span>
          {isOnline ? 'Back Online' : 'Offline Mode'}
        </div>
      )}

      {/* Update Available */}
      {updateAvailable && (
        <div style={{
          backgroundColor: '#2196f3',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          minWidth: '200px'
        }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>🔄 Update Available</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              New features ready!
            </div>
          </div>
          <button
            onClick={handleUpdateClick}
            style={{
              background: 'white',
              border: 'none',
              color: '#2196f3',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Update
          </button>
        </div>
      )}

      {/* Offline indicator */}
      {!isOnline && !showStatus && (
        <div style={{
          backgroundColor: '#ff9800',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <span>⚡</span>
          Offline
        </div>
      )}
    </div>
  );
};

export default PWAStatus;
