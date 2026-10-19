import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'COB | Executive Interview Tracker',
  description: 'A thoughtful, consistent interview experience for Create On Base.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
