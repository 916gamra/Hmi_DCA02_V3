import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  isIos: boolean;
  isAndroid: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isTouch: false,
        isIos: false,
        isAndroid: false,
        orientation: 'portrait',
        screenWidth: 1024,
      };
    }

    const ua = navigator.userAgent || '';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const width = window.innerWidth;
    const isMobile = width < 768 || (isTouch && /Mobi/i.test(ua));
    const isTablet = width >= 768 && width <= 1024 && isTouch;

    return {
      isMobile,
      isTablet,
      isTouch,
      isIos,
      isAndroid,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      screenWidth: width,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const ua = navigator.userAgent || '';
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isIos = /iPad|iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      const width = window.innerWidth;
      const isMobile = width < 768 || (isTouch && /Mobi/i.test(ua));
      const isTablet = width >= 768 && width <= 1024 && isTouch;

      setDeviceInfo({
        isMobile,
        isTablet,
        isTouch,
        isIos,
        isAndroid,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        screenWidth: width,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
