import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Comp Intelligence",
  description: "Structured compensation intelligence by company, level, role, and location."
};

const navItems = [
  { href: "/", label: "Salaries" },
  { href: "/compare", label: "Compare" },
  { href: "/companies", label: "Companies" }
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Comp Intelligence
            </Link>
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-panel"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
