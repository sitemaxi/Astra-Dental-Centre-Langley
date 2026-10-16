import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Loader2, RotateCw, MailX } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { requestFormEmail, type EmailStatus, type FormEmailType } from "../../lib/formEmail";

const STATUS_STYLES: Record<EmailStatus, { label: string; className: string; Icon: typeof Clock }> = {
  sent: { label: "Email sent", className: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  failed: { label: "Email failed", className: "bg-red-50 text-red-700 border-red-200", Icon: AlertTriangle },
  not_sent: { label: "Not sent", className: "bg-amber-50 text-amber-700 border-amber-200", Icon: MailX },
  pending: { label: "Sending", className: "bg-blue-50 text-blue-700 border-blue-200", Icon: Clock },
  sending: { label: "Sending", className: "bg-blue-50 text-blue-700 border-blue-200", Icon: Clock },
};

export function needsEmailAttention(status: EmailStatus): boolean {
  return status === "failed" || status === "not_sent";
}

interface EmailStatusCellProps {
  type: FormEmailType;
  id: string;
  status: EmailStatus;
  error: string | null;
  onChange: (status: EmailStatus, error: string | null) => void;
}

export default function EmailStatusCell({ type, id, status, error, onChange }: EmailStatusCellProps) {
  const [resending, setResending] = useState(false);
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.not_sent;
  const canResend = needsEmailAttention(status);

  const handleResend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setResending(true);
    const { data } = await supabase.auth.getSession();
    const result = await requestFormEmail(type, id, data.session?.access_token);
    onChange(result.ok ? "sent" : "failed", result.ok ? null : result.error ?? "Email could not be sent");
    setResending(false);
  };

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span
        title={error ?? undefined}
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${style.className}`}
      >
        <style.Icon size={11} />
        {style.label}
      </span>
      {status === "failed" && error && (
        <span className="text-[11px] leading-snug text-red-600 max-w-[200px]">{error}</span>
      )}
      {canResend && (
        <button
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-60 transition-colors"
        >
          {resending ? <Loader2 size={11} className="animate-spin" /> : <RotateCw size={11} />}
          {resending ? "Sending..." : "Resend email"}
        </button>
      )}
    </div>
  );
}
