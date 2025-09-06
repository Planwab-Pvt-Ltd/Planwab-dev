'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeClerkProvider({ children }) {
    const { theme } = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <ClerkProvider>{children}</ClerkProvider>;
    }
    
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: isDark ? dark : undefined,
                variables: {
                    colorPrimary: '#f59e0b',
                    colorBackground: isDark ? '#111827' : '#FFFFFF',
                    colorText: isDark ? '#f9fafb' : '#111827',
                    colorInputBackground: isDark ? '#1f2937' : '#FFFFFF',
                    colorTextSecondary: isDark ? '#d1d5db' : '#6b7280',
                },
                elements: {
                    card: 'shadow-xl border border-gray-200 dark:border-gray-700',
                    formButtonPrimary: 'bg-amber-500 hover:bg-amber-600',
                    footerActionLink: 'text-amber-500 hover:text-amber-600'
                }
            }}
        >
            {children}
        </ClerkProvider>
    );
}

