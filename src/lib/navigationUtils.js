export function encodeBackToUrl(url) {
  try {
    return encodeURIComponent(btoa(url));
  } catch (error) {
    return encodeURIComponent(url);
  }
}

/**
 * Decode backTo parameter
 */
export function decodeBackToUrl(encodedUrl) {
  try {
    return atob(decodeURIComponent(encodedUrl));
  } catch (error) {
    try {
      return decodeURIComponent(encodedUrl);
    } catch (e) {
      return null;
    }
  }
}

/**
 * Get current full URL (pathname + search + hash)
 */
export function getCurrentFullUrl() {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + window.location.search + window.location.hash;
}

/**
 * Build URL with backTo parameter
 * @param {string} targetUrl - Where you want to go
 * @param {string} [currentUrl] - Where you are now (optional, defaults to current)
 * @returns {string} Target URL with backTo param
 */
export function buildUrlWithBackTo(targetUrl, currentUrl) {
  const source = currentUrl || getCurrentFullUrl();
  const encoded = encodeBackToUrl(source);
  
  const [basePath, existingParams] = targetUrl.split('?');
  const params = new URLSearchParams(existingParams);
  params.set('backTo', encoded);
  
  return `${basePath}?${params.toString()}`;
}

/**
 * Get backTo URL from current page
 * @returns {string|null} The URL to go back to, or null
 */
export function getBackToUrl() {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const backTo = params.get('backTo');
  
  return backTo ? decodeBackToUrl(backTo) : null;
}

/**
 * Check if current page has backTo parameter
 */
export function hasBackTo() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('backTo');
}