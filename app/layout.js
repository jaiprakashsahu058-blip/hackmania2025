import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/contexts/ThemeContext';
import "./globals.css";

// Google font fetching is disabled to allow offline builds.

export const metadata = {
  title: "AI Course Generator - Generate AI Courses in Seconds",
  description: "Create comprehensive AI-powered courses in seconds with our intelligent course generation platform.",
  keywords: "AI course generator, online learning, course creation, artificial intelligence",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
