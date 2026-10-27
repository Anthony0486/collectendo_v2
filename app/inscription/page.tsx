import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function InscriptionPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const configured = isSupabaseConfigured();

  return (
    <SiteLayout isAuthenticated={false}>
      <div className="py-6">
        <RegisterForm isConfigured={configured} />
      </div>
    </SiteLayout>
  );
}

