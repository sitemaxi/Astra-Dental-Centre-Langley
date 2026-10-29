import { supabase } from "./supabase";

export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export type AccessRecordType = "appointment" | "new_patient";

export async function logRecordAccess(
  recordType: AccessRecordType,
  recordId: string,
  action: "view" | "export",
): Promise<void> {
  const { error } = await supabase.rpc("log_record_access", {
    p_record_type: recordType,
    p_record_id: recordId,
    p_action: action,
  });
  if (error) throw error;
}
