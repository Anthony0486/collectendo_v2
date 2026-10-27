import { getCurrentUser } from "@/lib/supabase/server";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

type SiteLayoutProps = {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  username?: string;
};

export async function SiteLayout({
  children,
  isAuthenticated,
  username,
}: SiteLayoutProps) {
  const user =
    isAuthenticated === undefined || username === undefined
      ? await getCurrentUser()
      : null;

  const resolvedAuth = isAuthenticated ?? Boolean(user);
  const resolvedUsername = username ?? user?.username;

  return (
    <div className="min-h-screen bg-[#fff] text-slate-900">
      <Navbar isAuthenticated={resolvedAuth} username={resolvedUsername} />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <Sidebar isAuthenticated={resolvedAuth} />

        <main className="flex-1 rounded-2xl border border-red-100 bg-[#f5f5f5] p-4 sm:p-6">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}