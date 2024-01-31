import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";

import { DNA } from "react-loader-spinner";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <ClerkLoading>
            <div className="h-screen flex justify-center items-center">
              <DNA height={200} width={200} />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <Component {...pageProps} />
          </ClerkLoaded>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
export default MyApp;
