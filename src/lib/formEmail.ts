export type FormEmailType = "appointment" | "new_patient";
export type EmailStatus = "pending" | "sending" | "sent" | "failed" | "not_sent";

export async function requestFormEmail(
  type: FormEmailType,
  id: string,
  accessToken?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-form-email`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken ?? import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type, id }),
    });
    const body = await res.json().catch(() => null);
    if (res.ok && body?.success) return { ok: true };
    return { ok: false, error: typeof body?.error === "string" ? body.error : `Request failed (${res.status})` };
  } catch {
    return { ok: false, error: "Could not reach the email service." };
  }
}
