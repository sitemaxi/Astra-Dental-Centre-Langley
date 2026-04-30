import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "npm:emailjs@4.0.3";
import { PDFDocument, StandardFonts, rgb, PageSizes } from "npm:pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CLINIC_EMAIL = "reception@astradentalcentre.com";
const CC_EMAIL = "operations@sitemaxi.com";
const FROM_EMAIL = "marketing@sitemaxi.com";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type FormData = Record<string, string | string[]>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function yesNo(val: string | undefined): string {
  if (val === "yes") return "Yes";
  if (val === "no") return "No";
  if (val === "not_sure") return "Not Sure / Maybe";
  return val || "—";
}

function val(v: string | string[] | undefined): string {
  if (!v) return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "None";
  return v || "—";
}

// ---------------------------------------------------------------------------
// PDF Generation
// ---------------------------------------------------------------------------
async function generateFilledPDF(d: FormData): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const NAVY = rgb(0.051, 0.306, 0.431);   // #0d4e6e
  const TEAL = rgb(0.090, 0.639, 0.533);   // #17a389
  const DARK = rgb(0.102, 0.102, 0.180);   // #1a1a2e
  const GREY = rgb(0.333, 0.333, 0.333);
  const LIGHT_GREY = rgb(0.95, 0.95, 0.95);
  const WHITE = rgb(1, 1, 1);

  const margin = 50;
  const pageWidth = PageSizes.Letter[0];
  const pageHeight = PageSizes.Letter[1];
  const contentWidth = pageWidth - margin * 2;

  // State per page
  let page = pdfDoc.addPage(PageSizes.Letter);
  let y = pageHeight - margin;

  function ensureSpace(needed: number) {
    if (y - needed < margin + 20) {
      page = pdfDoc.addPage(PageSizes.Letter);
      y = pageHeight - margin;
      drawPageHeader();
    }
  }

  function drawPageHeader() {
    // Thin teal bar at top
    page.drawRectangle({ x: 0, y: pageHeight - 28, width: pageWidth, height: 28, color: NAVY });
    page.drawText("Astra Dental Centre — New Patient Medical Questionnaire", {
      x: margin,
      y: pageHeight - 19,
      size: 9,
      font: fontRegular,
      color: WHITE,
    });
  }

  function drawTitle() {
    page.drawRectangle({ x: 0, y: pageHeight - 90, width: pageWidth, height: 62, color: NAVY });
    page.drawText("New Patient Medical Questionnaire", {
      x: margin,
      y: pageHeight - 55,
      size: 18,
      font: fontBold,
      color: WHITE,
    });
    page.drawText("Astra Dental Centre  |  All information is strictly private and confidential.", {
      x: margin,
      y: pageHeight - 74,
      size: 9,
      font: fontRegular,
      color: rgb(0.8, 0.9, 0.95),
    });
    y = pageHeight - 108;
  }

  function drawSectionHeader(title: string) {
    ensureSpace(34);
    y -= 10;
    page.drawRectangle({ x: margin - 4, y: y - 4, width: contentWidth + 8, height: 22, color: NAVY });
    page.drawText(title, { x: margin + 2, y: y + 3, size: 10, font: fontBold, color: WHITE });
    y -= 18;
  }

  function drawField(label: string, value: string, indent = 0) {
    const lines = wrapText(value, fontRegular, 9, contentWidth - 150 - indent);
    const rowH = Math.max(18, lines.length * 13 + 6);
    ensureSpace(rowH);

    // Alternating row shading is handled by a simple counter outside, skip for simplicity
    page.drawRectangle({ x: margin + indent, y: y - rowH + 4, width: contentWidth - indent, height: rowH, color: LIGHT_GREY });
    page.drawText(label, { x: margin + indent + 4, y: y - 4, size: 8, font: fontBold, color: GREY });
    lines.forEach((line, i) => {
      page.drawText(line, { x: margin + indent + 154, y: y - 4 - i * 12, size: 9, font: fontRegular, color: DARK });
    });
    y -= rowH + 2;
  }

  function drawNote(text: string) {
    ensureSpace(28);
    y -= 4;
    page.drawRectangle({ x: margin, y: y - 20, width: contentWidth, height: 22, color: rgb(0.94, 0.99, 0.98) });
    page.drawRectangle({ x: margin, y: y - 20, width: 4, height: 22, color: TEAL });
    page.drawText(text, { x: margin + 12, y: y - 11, size: 8, font: fontRegular, color: rgb(0.05, 0.43, 0.35) });
    y -= 26;
  }

  function wrapText(text: string, font: typeof fontRegular, size: number, maxWidth: number): string[] {
    if (!text || text === "—") return [text || "—"];
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : ["—"];
  }

  // --------------- Build the PDF ---------------

  // Page 1 header
  drawTitle();

  // Section A
  drawSectionHeader("A — Personal Information");
  drawField("Name", val(`${d.title ? d.title + " " : ""}${d.first_name} ${d.last_name}`));
  drawField("Date of Birth", val(d.date_of_birth as string));
  drawField("Email", val(d.email as string));
  drawField("Phone", val(d.phone as string));
  drawField("Home Address", val(d.home_address as string));
  drawField("Business Address", val(d.business_address as string));
  drawField("Business Phone", val(d.business_phone as string));
  drawField("Occupation", val(d.occupation as string));
  drawField("Referred By", val(d.referred_by as string));

  // Section B
  drawSectionHeader("B — Emergency Contact & Care Providers");
  drawField("Emergency Contact", val(d.emergency_name as string));
  drawField("Relationship", val(d.emergency_relationship as string));
  drawField("Emergency Phone", val(d.emergency_phone as string));
  drawField("Family Doctor", val(d.family_doctor_name as string));
  drawField("Doctor Phone", val(d.family_doctor_phone as string));
  drawField("Pharmacy", val(d.pharmacy_name as string));
  drawField("Pharmacy Phone", val(d.pharmacy_phone as string));
  const spec1 = [d.specialist_1_name, d.specialist_1_area, d.specialist_1_contact].filter(Boolean).join(" — ");
  const spec2 = [d.specialist_2_name, d.specialist_2_area, d.specialist_2_contact].filter(Boolean).join(" — ");
  drawField("Specialist 1", val(spec1));
  drawField("Specialist 2", val(spec2));

  // Section C
  drawSectionHeader("C — Medical History Questionnaire");
  drawNote("All responses as submitted by patient. Dentist to review at appointment.");

  const questions: Array<[string, string]> = [
    ["1. Medical treatment (past year)", `${yesNo(d.q1_medical_treatment as string)}${d.q1_details ? " — " + d.q1_details : ""}`],
    ["2. Last medical checkup", val(d.q2_last_checkup as string)],
    ["3. Health change (past year)", `${yesNo(d.q3_health_change as string)}${d.q3_details ? " — " + d.q3_details : ""}`],
    ["4. Medications / supplements", `${yesNo(d.q4_medications as string)}${d.q4_details ? " — " + d.q4_details : ""}`],
    ["5. Allergies", `${yesNo(d.q5_allergies as string)}${d.q5_medications ? " | Meds: " + d.q5_medications : ""}${d.q5_latex ? " | Latex: " + d.q5_latex : ""}${d.q5_other ? " | Other: " + d.q5_other : ""}`],
    ["6. Adverse reaction to medicines", `${yesNo(d.q6_adverse_reaction as string)}${d.q6_details ? " — " + d.q6_details : ""}`],
    ["7. Asthma", yesNo(d.q7_asthma as string)],
    ["8. Heart / blood pressure", yesNo(d.q8_heart_blood_pressure as string)],
    ["9. Heart valve / transplant", yesNo(d.q9_heart_valve_transplant as string)],
    ["10. Prosthetic / artificial joint", yesNo(d.q10_prosthetic_joint as string)],
    ["11. Immune conditions / therapies", yesNo(d.q11_immune_conditions as string)],
    ["12. Hepatitis / jaundice / liver disease", yesNo(d.q12_hepatitis_liver as string)],
    ["13. Bleeding problem / disorder", yesNo(d.q13_bleeding_disorder as string)],
    ["14. Hospitalized", `${yesNo(d.q14_hospitalized as string)}${d.q14_details ? " — " + d.q14_details : ""}`],
    ["15. Conditions checklist", (() => {
      const c = d.q15_conditions;
      if (!c) return "None";
      if (Array.isArray(c)) return c.length ? c.join(", ") : "None";
      try { const parsed = JSON.parse(c); return Array.isArray(parsed) && parsed.length ? parsed.join(", ") : "None"; } catch { return String(c) || "None"; }
    })()],
    ["16. Other conditions", `${yesNo(d.q16_other_conditions as string)}${d.q16_details ? " — " + d.q16_details : ""}`],
    ["17. Family history", `${yesNo(d.q17_family_history as string)}${d.q17_details ? " — " + d.q17_details : ""}`],
    ["18. Tobacco use", yesNo(d.q18_tobacco as string)],
    ["19. Nervous during dental treatment", yesNo(d.q19_nervous_dental as string)],
    ["20. Pregnant / breastfeeding", `${yesNo(d.q20_pregnancy as string)}${d.q20_delivery_date ? " — Due: " + d.q20_delivery_date : ""}`],
  ];

  for (const [label, answer] of questions) {
    drawField(label, answer);
  }

  // Section D
  drawSectionHeader("D — Consent & Acknowledgement");
  drawField("Signature (typed)", val(d.patient_signature as string));
  drawField("Date Signed", val(d.signature_date as string));

  y -= 16;
  ensureSpace(36);
  page.drawRectangle({ x: margin, y: y - 28, width: contentWidth, height: 32, color: rgb(0.94, 0.99, 0.98) });
  page.drawRectangle({ x: margin, y: y - 28, width: 4, height: 32, color: TEAL });
  page.drawText("To the best of my knowledge, the above information is correct.", {
    x: margin + 12, y: y - 10, size: 9, font: fontRegular, color: DARK,
  });
  page.drawText("Dentist signature will be completed in-office at your appointment.", {
    x: margin + 12, y: y - 22, size: 8, font: fontRegular, color: GREY,
  });

  const pdfBytes = await pdfDoc.save();
  return btoa(String.fromCharCode(...pdfBytes));
}

// ---------------------------------------------------------------------------
// Email HTML builders
// ---------------------------------------------------------------------------
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

function buildAppointmentEmail(d: FormData): string {
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
        ${field("Email", d.email as string)}
        ${field("Phone", d.phone as string)}
        ${field("Service Requested", d.service as string)}
        ${field("Preferred Date", d.preferred_date as string)}
        ${field("Preferred Time", d.preferred_time as string)}
        ${d.message ? field("Additional Notes", d.message as string) : ""}
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

function buildNewPatientEmail(d: FormData): string {
  const conditions = (() => {
    const c = d.q15_conditions;
    if (!c) return "None";
    if (Array.isArray(c)) return c.length ? c.join(", ") : "None";
    try { const p = JSON.parse(c as string); return Array.isArray(p) && p.length ? p.join(", ") : "None"; } catch { return String(c) || "None"; }
  })();

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f7f6;margin:0;padding:20px;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#0d4e6e;padding:28px 32px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">New Patient Medical Questionnaire</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Astra Dental Centre — Full Form Submission (filled PDF attached)</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">

        ${sectionHeader("A — Personal Information")}
        ${field("Name", `${d.title ? d.title + " " : ""}${d.first_name} ${d.last_name}`)}
        ${field("Date of Birth", d.date_of_birth as string)}
        ${field("Email", d.email as string)}
        ${field("Phone", d.phone as string)}
        ${field("Home Address", d.home_address as string)}
        ${field("Business Address", d.business_address as string)}
        ${field("Business Phone", d.business_phone as string)}
        ${field("Occupation", d.occupation as string)}
        ${field("Referred By", d.referred_by as string)}

        ${sectionHeader("B — Emergency Contact & Care Providers")}
        ${field("Emergency Contact", d.emergency_name as string)}
        ${field("Relationship", d.emergency_relationship as string)}
        ${field("Emergency Phone", d.emergency_phone as string)}
        ${field("Family Doctor", d.family_doctor_name as string)}
        ${field("Doctor Phone", d.family_doctor_phone as string)}
        ${field("Pharmacy", d.pharmacy_name as string)}
        ${field("Pharmacy Phone", d.pharmacy_phone as string)}
        ${field("Specialist 1", [d.specialist_1_name, d.specialist_1_area, d.specialist_1_contact].filter(Boolean).join(" — ") || "—")}
        ${field("Specialist 2", [d.specialist_2_name, d.specialist_2_area, d.specialist_2_contact].filter(Boolean).join(" — ") || "—")}

        ${sectionHeader("C — Medical History")}
        ${field("1. Medical treatment (past year)", `${yesNo(d.q1_medical_treatment as string)}${d.q1_details ? " — " + d.q1_details : ""}`)}
        ${field("2. Last medical checkup", d.q2_last_checkup as string)}
        ${field("3. Health change (past year)", `${yesNo(d.q3_health_change as string)}${d.q3_details ? " — " + d.q3_details : ""}`)}
        ${field("4. Medications / supplements", `${yesNo(d.q4_medications as string)}${d.q4_details ? " — " + d.q4_details : ""}`)}
        ${field("5. Allergies", `${yesNo(d.q5_allergies as string)}${d.q5_medications ? " | Meds: " + d.q5_medications : ""}${d.q5_latex ? " | Latex: " + d.q5_latex : ""}${d.q5_other ? " | Other: " + d.q5_other : ""}`)}
        ${field("6. Adverse reaction to medicines", `${yesNo(d.q6_adverse_reaction as string)}${d.q6_details ? " — " + d.q6_details : ""}`)}
        ${field("7. Asthma", yesNo(d.q7_asthma as string))}
        ${field("8. Heart / blood pressure", yesNo(d.q8_heart_blood_pressure as string))}
        ${field("9. Heart valve / transplant", yesNo(d.q9_heart_valve_transplant as string))}
        ${field("10. Prosthetic / artificial joint", yesNo(d.q10_prosthetic_joint as string))}
        ${field("11. Immune conditions / therapies", yesNo(d.q11_immune_conditions as string))}
        ${field("12. Hepatitis / jaundice / liver disease", yesNo(d.q12_hepatitis_liver as string))}
        ${field("13. Bleeding problem / disorder", yesNo(d.q13_bleeding_disorder as string))}
        ${field("14. Hospitalized", `${yesNo(d.q14_hospitalized as string)}${d.q14_details ? " — " + d.q14_details : ""}`)}
        ${field("15. Conditions checklist", conditions)}
        ${field("16. Other conditions", `${yesNo(d.q16_other_conditions as string)}${d.q16_details ? " — " + d.q16_details : ""}`)}
        ${field("17. Family history", `${yesNo(d.q17_family_history as string)}${d.q17_details ? " — " + d.q17_details : ""}`)}
        ${field("18. Tobacco use", yesNo(d.q18_tobacco as string))}
        ${field("19. Nervous during dental treatment", yesNo(d.q19_nervous_dental as string))}
        ${field("20. Pregnant / breastfeeding", `${yesNo(d.q20_pregnancy as string)}${d.q20_delivery_date ? " — Due: " + d.q20_delivery_date : ""}`)}

        ${sectionHeader("D — Consent")}
        ${field("Signature (typed)", d.patient_signature as string)}
        ${field("Date Signed", d.signature_date as string)}

      </table>
      <div style="margin-top:28px;padding:16px;background:#f0fafa;border-radius:8px;border-left:4px solid #17a389;">
        <p style="margin:0;font-size:13px;color:#0d6e5e;">A filled PDF copy of this questionnaire is attached to this email.</p>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#aaa;">Sent automatically from the Astra Dental Centre website new patient form.</p>
    </div>
  </div>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
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
    const { type, data }: { type: string; data: FormData } = body;

    const client = new SMTPClient({
      user: gmailUser,
      password: gmailPass,
      host: "smtp.gmail.com",
      ssl: true,
      port: 465,
    });

    if (type === "appointment") {
      await client.sendAsync({
        from: `Astra Dental Website <${FROM_EMAIL}>`,
        to: CLINIC_EMAIL,
        cc: CC_EMAIL,
        subject: `New Appointment Request — ${data.first_name} ${data.last_name}`,
        attachment: [{ data: buildAppointmentEmail(data), alternative: true }],
      });

    } else if (type === "new_patient") {
      // Generate the filled PDF server-side
      const pdfBase64 = await generateFilledPDF(data);

      await client.sendAsync({
        from: `Astra Dental Website <${FROM_EMAIL}>`,
        to: CLINIC_EMAIL,
        cc: CC_EMAIL,
        subject: `New Patient Form — ${data.first_name} ${data.last_name}`,
        attachment: [
          { data: buildNewPatientEmail(data), alternative: true },
          {
            name: `NewPatient_${data.first_name}_${data.last_name}.pdf`,
            data: pdfBase64,
            type: "application/pdf",
            encoded: true,
          },
        ],
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
