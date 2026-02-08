'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  buildUrlWithBackTo,
  getBackToUrl,
  hasBackTo,
} from '@/lib/navigationUtils';

export function useNavigationState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentUrl = useMemo(() => {
    const search = searchParams.toString();
    return pathname + (search ? `?${search}` : '');
  }, [pathname, searchParams]);

  const getHrefWithState = useMemo(() => {
    return (targetUrl) => buildUrlWithBackTo(targetUrl, currentUrl);
  }, [currentUrl]);

  const backUrl = useMemo(() => getBackToUrl(), [searchParams]);

  const canGoBack = useMemo(() => hasBackTo(), [searchParams]);

  return {
    getHrefWithState,   
    backUrl,
    canGoBack,          
    currentUrl,       
  };
}