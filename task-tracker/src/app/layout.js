import './globals.css';

export const metadata = {
  title: 'task tracker app',
  description: 'a simple app to manage tasks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container mx-auto px-4">
          <header>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}