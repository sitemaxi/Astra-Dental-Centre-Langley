import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "npm:emailjs@4.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPass) {
      return new Response(
        JSON.stringify({ error: "Email credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { type, data } = body;

    let subject = "";
    let htmlBody = "";

    if (type === "appointment") {
      subject = `New Appointment Request — ${data.first_name} ${data.last_name}`;
      htmlBody = buildAppointmentEmail(data);
    } else if (type === "new_patient") {
      subject = `New Patient Form Submitted — ${data.first_name} ${data.last_name}`;
      htmlBody = buildNewPatientEmail(data);
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown form type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      user: gmailUser,
      password: gmailPass,
      host: "smtp.gmail.com",
      ssl: true,
      port: 465,
    });

    await client.sendAsync({
      from: `Astra Dental Website <${gmailUser}>`,
      to: "reception@astradentalcentre.com",
      subject,
      attachment: [{ data: htmlBody, alternative: true }],
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildAppointmentEmail(d: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f7f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background: #0d4e6e; padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Appointment Request</h1>
      <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 14px;">Astra Dental Centre — Website Form</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 40%;"><strong style="color: #555; font-size: 13px;">Patient Name</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.first_name} ${d.last_name}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Email</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.email}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Phone</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.phone}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Service</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.service}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Preferred Date</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.preferred_date}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Preferred Time</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.preferred_time}</td></tr>
        ${d.message ? `<tr><td style="padding: 10px 0;"><strong style="color: #555; font-size: 13px;">Notes</strong></td>
            <td style="padding: 10px 0; font-size: 14px; color: #1a1a2e;">${d.message}</td></tr>` : ""}
      </table>
      <div style="margin-top: 28px; padding: 16px; background: #f0fafa; border-radius: 8px; border-left: 4px solid #17a389;">
        <p style="margin: 0; font-size: 13px; color: #0d6e5e;">Please contact the patient to confirm appointment availability.</p>
      </div>
    </div>
    <div style="padding: 20px 32px; background: #f9fafb; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 12px; color: #999;">This notification was sent automatically from the Astra Dental Centre website contact form.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildNewPatientEmail(d: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f7f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background: #0d4e6e; padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Patient Form Submitted</h1>
      <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 14px;">Astra Dental Centre — Medical Questionnaire</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 40%;"><strong style="color: #555; font-size: 13px;">Patient Name</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.title ? d.title + " " : ""}${d.first_name} ${d.last_name}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Date of Birth</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.date_of_birth || "Not provided"}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Email</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.email}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Phone</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.phone}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #555; font-size: 13px;">Emergency Contact</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a2e;">${d.emergency_name || "Not provided"}${d.emergency_relationship ? " (" + d.emergency_relationship + ")" : ""} ${d.emergency_phone ? "— " + d.emergency_phone : ""}</td></tr>
        <tr><td style="padding: 10px 0;"><strong style="color: #555; font-size: 13px;">Referred By</strong></td>
            <td style="padding: 10px 0; font-size: 14px; color: #1a1a2e;">${d.referred_by || "Not provided"}</td></tr>
      </table>
      <div style="margin-top: 28px; padding: 16px; background: #f0fafa; border-radius: 8px; border-left: 4px solid #17a389;">
        <p style="margin: 0; font-size: 13px; color: #0d6e5e;">The full medical history questionnaire is available in the admin panel. Please review it before the patient's appointment.</p>
      </div>
    </div>
    <div style="padding: 20px 32px; background: #f9fafb; border-top: 1px solid #eee;">
      <p style="margin: 0; font-size: 12px; color: #999;">This notification was sent automatically from the Astra Dental Centre website new patient form.</p>
    </div>
  </div>
</body>
</html>`;
}
