export const metadata = {
  title: "Seller Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", background: "#0d0a1e", color: "#fff", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
