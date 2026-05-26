import "material-symbols/outlined.css";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";

export const metadata = {
  title: "Zero Agent",
  description: "Dark developer dashboard for AI providers, observability, and operations.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#050b14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){document.documentElement.classList.add('fonts-loaded')})}else{document.documentElement.classList.add('fonts-loaded')}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
