"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }) {
  // useState ensures the QueryClient is only created once per session
  // and data is preserved during navigation
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optional: Professional defaults
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false, // Prevents aggressive refetching
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}