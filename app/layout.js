import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = { title: "Seller Dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('dash-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
      </head>
      <body>
        <div className="bg-orbits"><span></span><span></span><span></span></div>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
