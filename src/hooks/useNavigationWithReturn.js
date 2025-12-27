"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Safely redirects to a new path while attaching the current path as a 'returnTo' param.
 * Prevents crashes if targetPath is missing or invalid.
 */
export function useRedirectWithReturn() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirect = useCallback(
    (targetPath) => {
      // 1. Safety Check: Ensure targetPath is a valid string
      if (!targetPath || typeof targetPath !== "string") {
        console.error("useRedirectWithReturn: 'targetPath' must be a valid string. Received:", targetPath);
        return;
      }

      try {
        // 2. Construct current URL (path + params)
        const currentQuery = searchParams?.toString();
        const currentFullUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

        // 3. Encode for safety
        const encodedReturnUrl = encodeURIComponent(currentFullUrl);

        // 4. Determine separator (? or &)
        const separator = targetPath.includes("?") ? "&" : "?";

        // 5. Navigate
        router.push(`${targetPath}${separator}returnTo=${encodedReturnUrl}`);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [router, pathname, searchParams]
  );

  return redirect;
}

/**
 * Safely goes back to the 'returnTo' path.
 * Falls back to 'defaultPath' if no return param exists.
 */
export function useReturnBack(defaultPath = "/") {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goBack = useCallback(() => {
    try {
      // 1. Get param
      const returnTo = searchParams?.get("returnTo");

      // 2. Validate returnTo
      if (returnTo && typeof returnTo === "string") {
        const decodedPath = decodeURIComponent(returnTo);
        router.push(decodedPath);
      } else {
        // 3. Fallback Safety: Ensure defaultPath is a string
        const safeFallback = typeof defaultPath === "string" ? defaultPath : "/";
        router.push(safeFallback);
      }
    } catch (error) {
      console.error("Return navigation error:", error);
      // Ultimate fallback to home to prevent app freeze
      router.push("/");
    }
  }, [router, searchParams, defaultPath]);

  return goBack;
}
