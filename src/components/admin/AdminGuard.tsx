import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { isCurrentUserAdmin } from "../../lib/adminAuth";

type GuardState = "checking" | "allowed" | "denied" | "error";

export default function AdminGuard() {
  const navigate = useNavigate();
  const [state, setState] = useState<GuardState>("checking");

  useEffect(() => {
    let active = true;
    let denying = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      try {
        const ok = await isCurrentUserAdmin(data.session.user.id);
        if (!active) return;
        if (ok) {
          setState("allowed");
        } else {
          denying = true;
          await supabase.auth.signOut();
          if (active) setState("denied");
        }
      } catch {
        if (active) setState("error");
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active && !denying) {
        navigate("/admin/login", { replace: true });
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (state === "allowed") return <Outlet />;

  if (state === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
          <ShieldAlert size={24} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {state === "denied" ? "Not authorised" : "Something went wrong"}
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {state === "denied"
            ? "This account does not have access to the admin area. You have been signed out."
            : "We couldn't confirm your access. Please sign in again."}
        </p>
        <Link
          to="/admin/login"
          className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
