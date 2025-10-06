import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal to not show again for a while
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null; // Don't show for 24 hours after dismissal
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          📱 Install BECE 2026 App
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          Get quick access and offline support!
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.5)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          style={{
            background: 'white',
            border: 'none',
            color: '#1976d2',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
