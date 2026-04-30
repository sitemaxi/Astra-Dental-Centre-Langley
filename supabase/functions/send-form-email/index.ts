import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "npm:emailjs@4.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CLINIC_EMAIL = "reception@astradentalcentre.com";
const CC_EMAIL = "operations@sitemaxi.com";
const PDF_URL = "https://gyqodvtskytuzifinoxq.supabase.co/storage/v1/object/public/site-assets/New_Patient_Medical_Questionnaire.pdf";

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

    const client = new SMTPClient({
      user: gmailUser,
      password: gmailPass,
      host: "smtp.gmail.com",
      ssl: true,
      port: 465,
    });

    if (type === "appointment") {
      await client.sendAsync({
        from: `Astra Dental Website <${gmailUser}>`,
        to: CLINIC_EMAIL,
        cc: CC_EMAIL,
        subject: `New Appointment Request — ${data.first_name} ${data.last_name}`,
        attachment: [{ data: buildAppointmentEmail(data), alternative: true }],
      });
    } else if (type === "new_patient") {
      // Fetch the blank PDF to attach
      let pdfAttachment: { name: string; data: string; type: string; encoded: boolean } | null = null;
      try {
        const pdfRes = await fetch(PDF_URL);
        if (pdfRes.ok) {
          const pdfBuf = await pdfRes.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuf)));
          pdfAttachment = {
            name: "New_Patient_Medical_Questionnaire.pdf",
            data: base64,
            type: "application/pdf",
            encoded: true,
          };
        }
      } catch (_) {
        // PDF fetch failure is non-fatal — email still sends without attachment
      }

      const attachments: object[] = [{ data: buildNewPatientEmail(data), alternative: true }];
      if (pdfAttachment) attachments.push(pdfAttachment);

      await client.sendAsync({
        from: `Astra Dental Website <${gmailUser}>`,
        to: CLINIC_EMAIL,
        cc: CC_EMAIL,
        subject: `New Patient Form Submitted — ${data.first_name} ${data.last_name}`,
        attachment: attachments,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown form type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function yesNo(val: string) {
  if (val === "yes") return "Yes";
  if (val === "no") return "No";
  if (val === "not_sure") return "Not Sure / Maybe";
  return val || "—";
}

function field(label: string, value: string | undefined) {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;border-bottom:1px solid #f0f0f0;width:42%;vertical-align:top;">
        <strong style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">${label}</strong>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1a1a2e;">${value || "—"}</td>
    </tr>`;
}

function sectionHeader(title: string) {
  return `<tr><td colspan="2" style="padding:20px 0 6px;"><p style="margin:0;font-size:13px;font-weight:700;color:#0d4e6e;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e0f0f0;padding-bottom:6px;">${title}</p></td></tr>`;
}

function buildAppointmentEmail(d: Record<string, string>): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f7f6;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#0d4e6e;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">New Appointment Request</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Astra Dental Centre — Website Booking Form</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        ${field("Patient Name", `${d.first_name} ${d.last_name}`)}
        ${field("Email", d.email)}
        ${field("Phone", d.phone)}
        ${field("Service Requested", d.service)}
        ${field("Preferred Date", d.preferred_date)}
        ${field("Preferred Time", d.preferred_time)}
        ${d.message ? field("Additional Notes", d.message) : ""}
      </table>
      <div style="margin-top:28px;padding:16px;background:#f0fafa;border-radius:8px;border-left:4px solid #17a389;">
        <p style="margin:0;font-size:13px;color:#0d6e5e;">Please contact the patient to confirm appointment availability.</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#aaa;">Sent automatically from the Astra Dental Centre website.</p>
    </div>
  </div>
</body></html>`;
}

function buildNewPatientEmail(d: Record<string, string>): string {
  const conditions = d.q15_conditions
    ? (Array.isArray(d.q15_conditions) ? d.q15_conditions : JSON.parse(d.q15_conditions || "[]")).join(", ") || "None checked"
    : "—";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f7f6;margin:0;padding:20px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#0d4e6e;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">New Patient Medical Questionnaire</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Astra Dental Centre — Full Form Submission</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">

        ${sectionHeader("A — Personal Information")}
        ${field("Name", `${d.title ? d.title + " " : ""}${d.first_name} ${d.last_name}`)}
        ${field("Date of Birth", d.date_of_birth)}
        ${field("Email", d.email)}
        ${field("Phone", d.phone)}
        ${field("Home Address", d.home_address)}
        ${field("Business Address", d.business_address)}
        ${field("Business Phone", d.business_phone)}
        ${field("Occupation", d.occupation)}
        ${field("Referred By", d.referred_by)}

        ${sectionHeader("B — Emergency Contact & Care Providers")}
        ${field("Emergency Contact", d.emergency_name)}
        ${field("Relationship", d.emergency_relationship)}
        ${field("Emergency Phone", d.emergency_phone)}
        ${field("Family Doctor", d.family_doctor_name)}
        ${field("Doctor Phone", d.family_doctor_phone)}
        ${field("Pharmacy", d.pharmacy_name)}
        ${field("Pharmacy Phone", d.pharmacy_phone)}
        ${field("Specialist 1", d.specialist_1_name ? `${d.specialist_1_name}${d.specialist_1_area ? " — " + d.specialist_1_area : ""}${d.specialist_1_contact ? " | " + d.specialist_1_contact : ""}` : "")}
        ${field("Specialist 2", d.specialist_2_name ? `${d.specialist_2_name}${d.specialist_2_area ? " — " + d.specialist_2_area : ""}${d.specialist_2_contact ? " | " + d.specialist_2_contact : ""}` : "")}

        ${sectionHeader("C — Medical History")}
        ${field("1. Medical treatment (past year)", `${yesNo(d.q1_medical_treatment)}${d.q1_details ? " — " + d.q1_details : ""}`)}
        ${field("2. Last medical checkup", d.q2_last_checkup)}
        ${field("3. Health change (past year)", `${yesNo(d.q3_health_change)}${d.q3_details ? " — " + d.q3_details : ""}`)}
        ${field("4. Medications / supplements", `${yesNo(d.q4_medications)}${d.q4_details ? " — " + d.q4_details : ""}`)}
        ${field("5. Allergies", `${yesNo(d.q5_allergies)}${d.q5_medications ? " | Meds: " + d.q5_medications : ""}${d.q5_latex ? " | Latex: " + d.q5_latex : ""}${d.q5_other ? " | Other: " + d.q5_other : ""}`)}
        ${field("6. Adverse reaction to medicines", `${yesNo(d.q6_adverse_reaction)}${d.q6_details ? " — " + d.q6_details : ""}`)}
        ${field("7. Asthma", yesNo(d.q7_asthma))}
        ${field("8. Heart / blood pressure problems", yesNo(d.q8_heart_blood_pressure))}
        ${field("9. Heart valve / transplant", yesNo(d.q9_heart_valve_transplant))}
        ${field("10. Prosthetic / artificial joint", yesNo(d.q10_prosthetic_joint))}
        ${field("11. Immune conditions / therapies", yesNo(d.q11_immune_conditions))}
        ${field("12. Hepatitis / jaundice / liver disease", yesNo(d.q12_hepatitis_liver))}
        ${field("13. Bleeding problem / disorder", yesNo(d.q13_bleeding_disorder))}
        ${field("14. Hospitalized", `${yesNo(d.q14_hospitalized)}${d.q14_details ? " — " + d.q14_details : ""}`)}
        ${field("15. Conditions checklist", conditions)}
        ${field("16. Other conditions", `${yesNo(d.q16_other_conditions)}${d.q16_details ? " — " + d.q16_details : ""}`)}
        ${field("17. Family history (diabetes, cancer, heart)", `${yesNo(d.q17_family_history)}${d.q17_details ? " — " + d.q17_details : ""}`)}
        ${field("18. Tobacco use", yesNo(d.q18_tobacco))}
        ${field("19. Nervous during dental treatment", yesNo(d.q19_nervous_dental))}
        ${field("20. Breastfeeding / Pregnant", `${yesNo(d.q20_pregnancy)}${d.q20_delivery_date ? " — Due: " + d.q20_delivery_date : ""}`)}

        ${sectionHeader("D — Consent")}
        ${field("Signature", d.patient_signature)}
        ${field("Date Signed", d.signature_date)}

      </table>
      <div style="margin-top:28px;padding:16px;background:#f0fafa;border-radius:8px;border-left:4px solid #17a389;">
        <p style="margin:0;font-size:13px;color:#0d6e5e;">The blank New Patient Medical Questionnaire PDF is attached to this email for reference.</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#aaa;">Sent automatically from the Astra Dental Centre website new patient form.</p>
    </div>
  </div>
</body></html>`;
}
