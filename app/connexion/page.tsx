import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function ConnexionPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const configured = isSupabaseConfigured();

  return (
    <SiteLayout isAuthenticated={false}>
      <div className="py-6">
        <LoginForm isConfigured={configured} />
      </div>
    </SiteLayout>
  );
}

