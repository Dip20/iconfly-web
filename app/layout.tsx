import './globals.css';

export const metadata = { title: 'IconFly' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans">{children}</body>
    </html>
  );
}
