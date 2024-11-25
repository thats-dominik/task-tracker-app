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
            <h1 className="text-3x1 font-bold my-4">task tracker</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}