import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, FileText, AlertCircle, Download, ChevronDown, ChevronUp } from "lucide-react";
import { jsPDF } from "jspdf";
import { supabase } from "../lib/supabase";

interface PatientForm {
  id: string;
  created_at: string;
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  home_address: string;
  phone: string;
  email: string;
  business_address: string;
  business_phone: string;
  occupation: string;
  referred_by: string;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  family_doctor_name: string;
  family_doctor_phone: string;
  pharmacy_name: string;
  pharmacy_phone: string;
  specialist_1_name: string;
  specialist_1_area: string;
  specialist_1_contact: string;
  specialist_2_name: string;
  specialist_2_area: string;
  specialist_2_contact: string;
  q1_medical_treatment: string;
  q1_details: string;
  q2_last_checkup: string;
  q3_health_change: string;
  q3_details: string;
  q4_medications: string;
  q4_details: string;
  q5_allergies: string;
  q5_medications: string;
  q5_latex: string;
  q5_other: string;
  q6_adverse_reaction: string;
  q6_details: string;
  q7_asthma: string;
  q8_heart_blood_pressure: string;
  q9_heart_valve_transplant: string;
  q10_prosthetic_joint: string;
  q11_immune_conditions: string;
  q12_hepatitis_liver: string;
  q13_bleeding_disorder: string;
  q14_hospitalized: string;
  q14_details: string;
  q15_conditions: string[];
  q16_other_conditions: string;
  q16_details: string;
  q17_family_history: string;
  q17_details: string;
  q18_tobacco: string;
  q19_nervous_dental: string;
  q20_pregnancy: string;
  q20_delivery_date: string | null;
  patient_signature: string;
  signature_date: string | null;
}

function fmtRadio(val: string): string {
  if (val === "yes") return "YES";
  if (val === "no") return "NO";
  if (val === "not_sure") return "NOT SURE/MAYBE";
  return "—";
}

function fmtDate(val: string | null): string {
  if (!val) return "—";
  return new Date(val + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });
}

const CONDITIONS_LIST = [
  "chest pain, angina",
  "heart attack",
  "stroke",
  "shortness of breath",
  "rheumatic fever",
  "mitral valve prolapse",
  "heart murmur",
  "pacemaker",
  "lung disease",
  "tuberculosis",
  "cancer",
  "steroid therapy",
  "diabetes",
  "stomach ulcers",
  "arthritis",
  "seizures (epilepsy)",
  "kidney disease",
  "thyroid disease",
  "drug/alcohol dependency",
  "osteoporosis medications (e.g. Fosamax, Actonel)",
];

function generatePatientFormPDF(f: PatientForm) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const W = 215.9;
  const marginL = 14;
  const marginR = 14;
  const contentW = W - marginL - marginR;
  const TEAL: [number, number, number] = [13, 148, 136];
  const NAVY: [number, number, number] = [11, 60, 93];
  const GRAY: [number, number, number] = [100, 116, 139];
  const LIGHT: [number, number, number] = [241, 245, 249];

  let y = 14;

  const checkPage = (needed: number) => {
    if (y + needed > 265) {
      doc.addPage();
      y = 14;
    }
  };

  const drawSectionHeader = (title: string) => {
    checkPage(10);
    doc.setFillColor(...NAVY);
    doc.roundedRect(marginL, y, contentW, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title, marginL + 4, y + 5.5);
    y += 11;
  };

  const drawFieldRow = (label: string, value: string, x: number, w: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const displayVal = value || "—";
    const lines = doc.splitTextToSize(displayVal, w - 1);
    doc.text(lines, x, y + 4);
    return lines.length * 4.5;
  };

  const drawHRule = () => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(marginL, y, marginL + contentW, y);
    y += 2.5;
  };

  const drawRadioBadge = (val: string, x: number, badgeY: number) => {
    const label = val === "yes" ? "YES" : val === "no" ? "NO" : val === "not_sure" ? "NOT SURE" : "—";
    const color: [number, number, number] =
      val === "yes" ? [220, 38, 38] : val === "no" ? [22, 163, 74] : [107, 114, 128];
    doc.setFillColor(...color);
    const badgeW = val === "not_sure" ? 18 : 10;
    doc.roundedRect(x, badgeY - 3.5, badgeW, 5, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(label, x + badgeW / 2, badgeY, { align: "center" });
  };

  const drawQuestionRow = (num: string, text: string, val: string, details?: string) => {
    const textW = contentW - 30;
    const wrappedText = doc.splitTextToSize(text, textW);
    const rowH = Math.max(wrappedText.length * 4.5 + 4, 10) + (details ? 6 : 0);
    checkPage(rowH + 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(num, marginL, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(wrappedText, marginL + 7, y + 4);
    drawRadioBadge(val, marginL + contentW - 20, y + 4);
    if (details) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const dLines = doc.splitTextToSize(details, contentW - 10);
      doc.text(dLines, marginL + 7, y + wrappedText.length * 4.5 + 5);
      y += wrappedText.length * 4.5 + 5 + dLines.length * 4;
    } else {
      y += wrappedText.length * 4.5 + 4;
    }
    drawHRule();
  };

  // ── HEADER ──────────────────────────────────────────────────────────────
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, W, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("ASTRA DENTAL CENTRE", marginL, 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(204, 241, 238);
  doc.text("Medical History Questionnaire", marginL, 16.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(204, 241, 238);
  const submittedStr = `Submitted: ${new Date(f.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}`;
  doc.text(submittedStr, W - marginR, 10, { align: "right" });
  doc.text("20061 Fraser Hwy #120, Langley, BC V3A 0R4", W - marginR, 16.5, { align: "right" });
  y = 28;

  // ── SECTION A — PERSONAL INFORMATION ────────────────────────────────────
  drawSectionHeader("A   PERSONAL INFORMATION");

  const col1X = marginL;
  const col2X = marginL + contentW / 2 + 2;
  const colW = contentW / 2 - 3;

  const nameVal = [f.title, f.first_name, f.last_name].filter(Boolean).join(" ");
  const r1h = Math.max(drawFieldRow("Full Name", nameVal, col1X, colW), drawFieldRow("Date of Birth", fmtDate(f.date_of_birth), col2X, colW));
  y += r1h + 4;
  checkPage(8);

  const r2h = Math.max(drawFieldRow("Phone", f.phone || "—", col1X, colW), drawFieldRow("Email Address", f.email || "—", col2X, colW));
  y += r2h + 4;
  checkPage(8);

  const r3h = Math.max(drawFieldRow("Home Address", f.home_address || "—", col1X, colW), drawFieldRow("Business Address", f.business_address || "—", col2X, colW));
  y += r3h + 4;
  checkPage(8);

  const r4h = Math.max(drawFieldRow("Business Phone", f.business_phone || "—", col1X, colW), drawFieldRow("Occupation", f.occupation || "—", col2X, colW));
  y += r4h + 4;
  checkPage(8);

  drawFieldRow("Referred By", f.referred_by || "—", col1X, contentW);
  y += 9;
  y += 3;

  // ── SECTION B — EMERGENCY CONTACT & CARE PROVIDERS ──────────────────────
  drawSectionHeader("B   EMERGENCY CONTACT & CARE PROVIDERS");

  checkPage(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...TEAL);
  doc.text("IN CASE OF EMERGENCY, NOTIFY:", marginL, y);
  y += 5;

  const r5h = Math.max(
    drawFieldRow("Name", f.emergency_name || "—", col1X, colW),
    drawFieldRow("Relationship", f.emergency_relationship || "—", col2X, colW)
  );
  y += r5h + 4;
  checkPage(8);

  drawFieldRow("Day-time Phone", f.emergency_phone || "—", col1X, colW);
  y += 9;
  checkPage(8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...TEAL);
  doc.text("FAMILY DOCTOR & PHARMACY:", marginL, y);
  y += 5;

  const r6h = Math.max(
    drawFieldRow("Family Doctor", f.family_doctor_name || "—", col1X, colW),
    drawFieldRow("Doctor Phone", f.family_doctor_phone || "—", col2X, colW)
  );
  y += r6h + 4;
  checkPage(8);

  const r7h = Math.max(
    drawFieldRow("Pharmacy", f.pharmacy_name || "—", col1X, colW),
    drawFieldRow("Pharmacy Phone", f.pharmacy_phone || "—", col2X, colW)
  );
  y += r7h + 4;
  checkPage(8);

  if (f.specialist_1_name || f.specialist_2_name) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...TEAL);
    doc.text("MEDICAL SPECIALISTS:", marginL, y);
    y += 5;

    if (f.specialist_1_name) {
      const colW3 = (contentW - 4) / 3;
      const col3bX = marginL + colW3 + 2;
      const col3cX = marginL + (colW3 + 2) * 2;
      const r8h = Math.max(
        drawFieldRow("(1) Name", f.specialist_1_name, col1X, colW3),
        drawFieldRow("Area of Speciality", f.specialist_1_area || "—", col3bX, colW3),
        drawFieldRow("Contact", f.specialist_1_contact || "—", col3cX, colW3)
      );
      y += r8h + 4;
      checkPage(8);
    }
    if (f.specialist_2_name) {
      const colW3 = (contentW - 4) / 3;
      const col3bX = marginL + colW3 + 2;
      const col3cX = marginL + (colW3 + 2) * 2;
      const r9h = Math.max(
        drawFieldRow("(2) Name", f.specialist_2_name, col1X, colW3),
        drawFieldRow("Area of Speciality", f.specialist_2_area || "—", col3bX, colW3),
        drawFieldRow("Contact", f.specialist_2_contact || "—", col3cX, colW3)
      );
      y += r9h + 4;
      checkPage(8);
    }
  }

  y += 3;

  // ── SECTION C — MEDICAL HISTORY ──────────────────────────────────────────
  drawSectionHeader("C   MEDICAL HISTORY QUESTIONNAIRE");

  checkPage(6);
  doc.setFillColor(...LIGHT);
  doc.roundedRect(marginL, y, contentW, 7, 1, 1, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("Please answer all questions. The dentist will review and explain any that you do not understand.", marginL + 3, y + 4.5);
  y += 10;

  drawQuestionRow("1.", "Are you being treated for any medical condition at the present or have you been treated within the past year?", f.q1_medical_treatment, f.q1_details || undefined);
  checkPage(8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("2.", marginL, y + 4);
  doc.text("When was your last medical checkup?", marginL + 7, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text(f.q2_last_checkup || "—", marginL + contentW - 40, y + 4);
  y += 8;
  drawHRule();
  drawQuestionRow("3.", "Has there been any change in your general health in the past year?", f.q3_health_change, f.q3_details || undefined);
  drawQuestionRow("4.", "Are you taking any medications, non-prescription drugs or herbal supplements?", f.q4_medications, f.q4_details || undefined);
  drawQuestionRow("5.", "Do you have any allergies? (medications, latex, other)", f.q5_allergies,
    [f.q5_medications && `Medications: ${f.q5_medications}`, f.q5_latex && `Latex: ${f.q5_latex}`, f.q5_other && `Other: ${f.q5_other}`].filter(Boolean).join("  |  ") || undefined);
  drawQuestionRow("6.", "Have you ever had a peculiar or adverse reaction to any medicines or injections?", f.q6_adverse_reaction, f.q6_details || undefined);
  drawQuestionRow("7.", "Do you have or have you ever had asthma?", f.q7_asthma);
  drawQuestionRow("8.", "Do you have or have you ever had any heart or blood pressure problems?", f.q8_heart_blood_pressure);
  drawQuestionRow("9.", "Replacement/repair of heart valve, infective endocarditis, congenital heart disease, or heart transplant?", f.q9_heart_valve_transplant);
  drawQuestionRow("10.", "Do you have a prosthetic or artificial joint?", f.q10_prosthetic_joint);
  drawQuestionRow("11.", "Any conditions affecting your immune system (leukemia, AIDS, HIV, radiotherapy, chemotherapy)?", f.q11_immune_conditions);
  drawQuestionRow("12.", "Have you ever had hepatitis, jaundice or liver disease?", f.q12_hepatitis_liver);
  drawQuestionRow("13.", "Do you have a bleeding problem or bleeding disorder?", f.q13_bleeding_disorder);
  drawQuestionRow("14.", "Have you ever been hospitalized for any illnesses or operations?", f.q14_hospitalized, f.q14_details || undefined);

  // Q15 — Conditions Checklist
  checkPage(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("15.", marginL, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text("Do you have or have you ever had any of the following? Please check.", marginL + 7, y + 4);
  y += 9;

  const conditions = Array.isArray(f.q15_conditions) ? f.q15_conditions : [];
  const colCount = 4;
  const condColW = contentW / colCount;
  const condStartY = y;
  let condRow = 0;
  let condCol = 0;

  CONDITIONS_LIST.forEach((cond) => {
    const cx = marginL + condCol * condColW;
    const cy = condStartY + condRow * 6;
    checkPage(6);
    const checked = conditions.includes(cond);
    doc.setDrawColor(...(checked ? TEAL : [203, 213, 225] as [number, number, number]));
    doc.setFillColor(...(checked ? TEAL : [255, 255, 255] as [number, number, number]));
    doc.setLineWidth(0.4);
    doc.rect(cx, cy - 3, 3.5, 3.5, checked ? "FD" : "D");
    if (checked) {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text("✓", cx + 0.5, cy - 0.2);
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(checked ? 30 : 100, checked ? 41 : 116, checked ? 59 : 139);
    const condLabel = cond.charAt(0).toUpperCase() + cond.slice(1);
    doc.text(condLabel, cx + 5, cy - 0.3);
    condCol++;
    if (condCol >= colCount) {
      condCol = 0;
      condRow++;
      y = condStartY + condRow * 6;
    }
  });

  if (condCol > 0) condRow++;
  y = condStartY + condRow * 6 + 4;

  drawHRule();

  drawQuestionRow("16.", "Are there any conditions or diseases not listed above that you have or have had?", f.q16_other_conditions, f.q16_details || undefined);
  drawQuestionRow("17.", "Are there any diseases or medical problems that run in your family? (e.g. diabetes, cancer, heart disease)", f.q17_family_history, f.q17_details || undefined);
  drawQuestionRow("18.", "Do you smoke or chew tobacco products?", f.q18_tobacco);
  drawQuestionRow("19.", "Are you nervous during dental treatment?", f.q19_nervous_dental);
  drawQuestionRow("20.", "For women only: Are you breastfeeding or pregnant?", f.q20_pregnancy,
    f.q20_delivery_date ? `Expected Delivery Date: ${fmtDate(f.q20_delivery_date)}` : undefined);

  y += 3;

  // ── SECTION D — CONSENT ───────────────────────────────────────────────────
  drawSectionHeader("D   CONSENT & ACKNOWLEDGEMENT");

  checkPage(35);
  doc.setFillColor(...LIGHT);
  doc.roundedRect(marginL, y, contentW, 28, 1.5, 1.5, "F");
  const consentLines = [
    "1.  I am aware that I will be charged $50 for any missed or cancelled appointments without 48 hours notice.",
    "2.  I am aware that if I am excessively late for my scheduled appointment I may not be seen.",
    "3.  I am aware that it is my responsibility as a patient to inform the office of any address, contact info or physician changes.",
    "4.  I am aware of my insurance plan and my co-pay portion and any change in the insurance will be informed.",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  let cy2 = y + 5;
  consentLines.forEach((cl) => {
    const wrapped = doc.splitTextToSize(cl, contentW - 6);
    doc.text(wrapped, marginL + 3, cy2);
    cy2 += wrapped.length * 4.5 + 1.5;
  });
  y += 31;

  checkPage(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("To the best of my knowledge, the above information is correct.", marginL, y);
  y += 8;

  const sigColW = contentW / 2 - 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text("PATIENT / PARENT / GUARDIAN SIGNATURE", marginL, y);
  doc.text("DATE", col2X, y);
  y += 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginL, y, sigColW, 9, 1, 1, "FD");
  doc.roundedRect(col2X, y, sigColW, 9, 1, 1, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text(f.patient_signature || "—", marginL + 3, y + 6);
  doc.text(fmtDate(f.signature_date), col2X + 3, y + 6);
  y += 13;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text("Dentist signature will be completed in-office at your appointment.", marginL, y);

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.3);
    doc.line(marginL, 272, W - marginR, 272);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...GRAY);
    doc.text("Astra Dental Centre  |  20061 Fraser Hwy #120, Langley, BC V3A 0R4  |  604-533-8806", W / 2, 276, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, W - marginR, 276, { align: "right" });
  }

  const fname = `${f.first_name}_${f.last_name}_Medical_Questionnaire.pdf`.replace(/\s+/g, "_");
  doc.save(fname);
}

function ExpandedDetail({ form }: { form: PatientForm }) {
  const conditions = Array.isArray(form.q15_conditions) ? form.q15_conditions : [];

  return (
    <div className="px-4 pb-6 pt-2 space-y-6 bg-gray-50/60">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetailGroup title="Personal">
          <DetailItem label="Date of Birth" value={fmtDate(form.date_of_birth)} />
          <DetailItem label="Home Address" value={form.home_address} />
          <DetailItem label="Business Phone" value={form.business_phone} />
          <DetailItem label="Occupation" value={form.occupation} />
          <DetailItem label="Referred By" value={form.referred_by} />
        </DetailGroup>
        <DetailGroup title="Emergency Contact">
          <DetailItem label="Name" value={form.emergency_name} />
          <DetailItem label="Relationship" value={form.emergency_relationship} />
          <DetailItem label="Phone" value={form.emergency_phone} />
          <DetailItem label="Family Doctor" value={form.family_doctor_name} />
          <DetailItem label="Doctor Phone" value={form.family_doctor_phone} />
          <DetailItem label="Pharmacy" value={form.pharmacy_name} />
        </DetailGroup>
        <DetailGroup title="Medical Questions (Q1–Q14)">
          <DetailItem label="Q1 Medical treatment" value={fmtRadio(form.q1_medical_treatment)} extra={form.q1_details} />
          <DetailItem label="Q2 Last checkup" value={form.q2_last_checkup || "—"} />
          <DetailItem label="Q3 Health change" value={fmtRadio(form.q3_health_change)} extra={form.q3_details} />
          <DetailItem label="Q4 Medications" value={fmtRadio(form.q4_medications)} extra={form.q4_details} />
          <DetailItem label="Q5 Allergies" value={fmtRadio(form.q5_allergies)} />
          <DetailItem label="Q7 Asthma" value={fmtRadio(form.q7_asthma)} />
          <DetailItem label="Q8 Heart/BP" value={fmtRadio(form.q8_heart_blood_pressure)} />
          <DetailItem label="Q13 Bleeding" value={fmtRadio(form.q13_bleeding_disorder)} />
          <DetailItem label="Q14 Hospitalized" value={fmtRadio(form.q14_hospitalized)} extra={form.q14_details} />
        </DetailGroup>
      </div>
      {conditions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Q15 Conditions Checked</p>
          <div className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <span key={c} className="text-xs bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2.5 py-1 capitalize">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailItem label="Q16 Other conditions" value={fmtRadio(form.q16_other_conditions)} extra={form.q16_details} />
        <DetailItem label="Q17 Family history" value={fmtRadio(form.q17_family_history)} extra={form.q17_details} />
        <DetailItem label="Q18 Tobacco" value={fmtRadio(form.q18_tobacco)} />
        <DetailItem label="Q19 Nervous" value={fmtRadio(form.q19_nervous_dental)} />
        <DetailItem label="Q20 Pregnancy" value={fmtRadio(form.q20_pregnancy)} extra={form.q20_delivery_date ? `Delivery: ${fmtDate(form.q20_delivery_date)}` : ""} />
      </div>
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Signature</p>
        <p className="text-sm text-gray-800">{form.patient_signature || "—"} — {fmtDate(form.signature_date)}</p>
      </div>
    </div>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailItem({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400">{label}: </span>
      <span className="text-xs font-medium text-gray-700">{value || "—"}</span>
      {extra && <p className="text-xs text-gray-500 mt-0.5 pl-2 border-l-2 border-gray-200">{extra}</p>}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminPatientFormsPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<PatientForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("new_patient_forms")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setForms((data ?? []) as PatientForm[]);
    } catch {
      setError("Failed to load patient forms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchForms(); }, [fetchForms]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/admin/blog" className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
              Astra Admin
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">Patient Forms</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/blog"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <FileText size={18} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">New Patient Forms</h1>
              <p className="text-sm text-gray-500">{forms.length} submission{forms.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Patient</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date of Birth</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Submitted</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : forms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={36} className="text-gray-200" />
                        <p className="text-sm text-gray-400">No patient forms submitted yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  forms.map((f) => (
                    <>
                      <tr
                        key={f.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <div className="flex items-center gap-2">
                            {expandedId === f.id ? (
                              <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                            )}
                            {[f.title, f.first_name, f.last_name].filter(Boolean).join(" ")}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {fmtDate(f.date_of_birth)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <div>{f.email}</div>
                          <div className="text-xs text-gray-400">{f.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(f.created_at).toLocaleDateString("en-CA", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => generatePatientFormPDF(f)}
                              className="flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
                              title="Download PDF"
                            >
                              <Download size={12} />
                              Download PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === f.id && (
                        <tr key={`${f.id}-detail`} className="border-b border-gray-100">
                          <td colSpan={5} className="p-0">
                            <ExpandedDetail form={f} />
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
