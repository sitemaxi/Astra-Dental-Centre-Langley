import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";
import { trackFormSubmit, trackFbLead } from "../lib/analytics";

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-300 bg-white";

const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2";

type RadioVal = "yes" | "no" | "not_sure" | "";

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

interface FormState {
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
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
  q1_medical_treatment: RadioVal;
  q1_details: string;
  q2_last_checkup: string;
  q3_health_change: RadioVal;
  q3_details: string;
  q4_medications: RadioVal;
  q4_details: string;
  q5_allergies: RadioVal;
  q5_medications: string;
  q5_latex: string;
  q5_other: string;
  q6_adverse_reaction: RadioVal;
  q6_details: string;
  q7_asthma: RadioVal;
  q8_heart_blood_pressure: RadioVal;
  q9_heart_valve_transplant: RadioVal;
  q10_prosthetic_joint: RadioVal;
  q11_immune_conditions: RadioVal;
  q12_hepatitis_liver: RadioVal;
  q13_bleeding_disorder: RadioVal;
  q14_hospitalized: RadioVal;
  q14_details: string;
  q15_conditions: string[];
  q16_other_conditions: RadioVal;
  q16_details: string;
  q17_family_history: RadioVal;
  q17_details: string;
  q18_tobacco: RadioVal;
  q19_nervous_dental: RadioVal;
  q20_pregnancy: RadioVal;
  q20_delivery_date: string;
  patient_signature: string;
  signature_date: string;
}

const initialForm: FormState = {
  title: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  home_address: "",
  phone: "",
  email: "",
  business_address: "",
  business_phone: "",
  occupation: "",
  referred_by: "",
  emergency_name: "",
  emergency_relationship: "",
  emergency_phone: "",
  family_doctor_name: "",
  family_doctor_phone: "",
  pharmacy_name: "",
  pharmacy_phone: "",
  specialist_1_name: "",
  specialist_1_area: "",
  specialist_1_contact: "",
  specialist_2_name: "",
  specialist_2_area: "",
  specialist_2_contact: "",
  q1_medical_treatment: "",
  q1_details: "",
  q2_last_checkup: "",
  q3_health_change: "",
  q3_details: "",
  q4_medications: "",
  q4_details: "",
  q5_allergies: "",
  q5_medications: "",
  q5_latex: "",
  q5_other: "",
  q6_adverse_reaction: "",
  q6_details: "",
  q7_asthma: "",
  q8_heart_blood_pressure: "",
  q9_heart_valve_transplant: "",
  q10_prosthetic_joint: "",
  q11_immune_conditions: "",
  q12_hepatitis_liver: "",
  q13_bleeding_disorder: "",
  q14_hospitalized: "",
  q14_details: "",
  q15_conditions: [],
  q16_other_conditions: "",
  q16_details: "",
  q17_family_history: "",
  q17_details: "",
  q18_tobacco: "",
  q19_nervous_dental: "",
  q20_pregnancy: "",
  q20_delivery_date: "",
  patient_signature: "",
  signature_date: "",
};

function RadioGroup({
  name,
  value,
  onChange,
}: {
  name: keyof FormState;
  value: RadioVal;
  onChange: (name: keyof FormState, val: RadioVal) => void;
}) {
  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      {(["yes", "no", "not_sure"] as const).map((opt) => (
        <label key={opt} className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(name, opt)}
            className="w-4 h-4 border-2 border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
            {opt === "yes" ? "YES" : opt === "no" ? "NO" : "NOT SURE/MAYBE"}
          </span>
        </label>
      ))}
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <h2 className="text-lg font-bold text-navy-900 font-poppins">{title}</h2>
    </div>
  );
}

export default function NewPatientFormPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setError("");
  }

  function handleRadio(name: keyof FormState, val: RadioVal) {
    setForm((prev) => ({ ...prev, [name]: val }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setError("");
  }

  function handleConditionToggle(condition: string) {
    setForm((prev) => {
      const current = prev.q15_conditions;
      if (current.includes(condition)) {
        return { ...prev, q15_conditions: current.filter((c) => c !== condition) };
      }
      return { ...prev, q15_conditions: [...current, condition] };
    });
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.first_name.trim()) errors.first_name = "Required";
    if (!form.last_name.trim()) errors.last_name = "Required";
    if (!form.phone.trim()) errors.phone = "Required";
    if (!form.email.trim()) errors.email = "Required";
    if (!form.patient_signature.trim()) errors.patient_signature = "Signature required";
    if (!form.signature_date) errors.signature_date = "Date required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setError("Please complete all required fields before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      date_of_birth: form.date_of_birth || null,
      q20_delivery_date: form.q20_delivery_date || null,
      signature_date: form.signature_date || null,
    };

    const { error: dbError } = await supabase.from("new_patient_forms").insert(payload);

    if (dbError) {
      setSubmitting(false);
      setError("Something went wrong. Please try again or call us directly at 604-533-8806.");
      return;
    }

    // Fire-and-forget email notification — does not block success flow
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-form-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type: "new_patient",
        data: { ...form },
      }),
    }).catch(() => { /* email failure is silent — data is already saved */ });

    trackFormSubmit("new_patient_form");
    trackFbLead();
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-teal-500" />
          </div>
          <h1 className="font-poppins text-3xl font-bold text-navy-900 mb-4">
            Thank You, {form.first_name}!
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            Your medical history questionnaire has been received. Our team will review it before your appointment. You do not need to bring a paper copy.
          </p>
          <p className="text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-8">
            If you have any questions before your visit, please call us at{" "}
            <a href="tel:604-533-8806" className="font-semibold text-amber-700 hover:underline">604-533-8806</a>.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-teal-700 transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <SEOHead
        title="New Patient Form | Astra Dental Centre Langley, BC"
        description="Complete your new patient medical questionnaire online before your first visit to Astra Dental Centre in Langley, BC. Saves time at your appointment."
        keywords="new patient form dentist Langley, dental questionnaire, Astra Dental new patient, first dental visit Langley"
        canonicalPath="/patient-info/new-patient-form/"
      />
      {/* Hero */}
      <div className="bg-navy-950 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-5">
            <Link to="/" className="text-white/60 hover:text-teal-400 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-white/40" />
            <span className="text-white/60">Patient Info</span>
            <ChevronRight size={12} className="text-white/40" />
            <span className="text-white font-semibold">New Patient Form</span>
          </nav>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-3">
            New Patient Medical Questionnaire
          </h1>
          <p className="text-white text-base leading-relaxed max-w-2xl">
            The following information is required to enable us to provide you with the best possible dental care. All information is strictly private and protected by doctor-patient confidentiality.
          </p>
        </div>
      </div>

      {/* Download Banner */}
      <div className="bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white text-sm font-medium">
            Prefer paper? Download the form and bring it to your appointment.
          </p>
          <a
            href={`${window.location.origin}/New_Patient_Medical_Questionnaire.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-teal-700 font-semibold text-sm px-4 py-2 rounded-full hover:bg-teal-50 transition-colors flex-shrink-0"
          >
            <Download size={14} />
            Download PDF
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-8">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* SECTION A — Personal Information */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <SectionHeader number="A" title="Personal Information" />
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <select name="title" value={form.title} onChange={handleChange} className={inputClass}>
                    <option value="">Select...</option>
                    {["Mr.", "Miss", "Mrs.", "Ms.", "Dr."].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>First Name <span className="text-red-400">*</span></label>
                  <input
                    name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                    className={`${inputClass} ${fieldErrors.first_name ? "border-red-300 focus:border-red-400" : ""}`}
                    placeholder="Jane"
                  />
                  {fieldErrors.first_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.first_name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-red-400">*</span></label>
                  <input
                    name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                    className={`${inputClass} ${fieldErrors.last_name ? "border-red-300 focus:border-red-400" : ""}`}
                    placeholder="Smith"
                  />
                  {fieldErrors.last_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.last_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Birth (Day/Month/Year)</label>
                  <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone <span className="text-red-400">*</span></label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    className={`${inputClass} ${fieldErrors.phone ? "border-red-300" : ""}`}
                    placeholder="604-000-0000"
                  />
                  {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  className={`${inputClass} ${fieldErrors.email ? "border-red-300" : ""}`}
                  placeholder="jane@example.com"
                />
                {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className={labelClass}>Home Address</label>
                <textarea name="home_address" rows={2} value={form.home_address} onChange={handleChange}
                  className={`${inputClass} resize-none`} placeholder="Street address, city, province, postal code" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business Address</label>
                  <textarea name="business_address" rows={2} value={form.business_address} onChange={handleChange}
                    className={`${inputClass} resize-none`} placeholder="Business address" />
                </div>
                <div>
                  <label className={labelClass}>Business Phone</label>
                  <input name="business_phone" type="tel" value={form.business_phone} onChange={handleChange}
                    className={inputClass} placeholder="604-000-0000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Occupation</label>
                  <input name="occupation" type="text" value={form.occupation} onChange={handleChange}
                    className={inputClass} placeholder="Your occupation" />
                </div>
                <div>
                  <label className={labelClass}>Who Referred You to Our Office?</label>
                  <input name="referred_by" type="text" value={form.referred_by} onChange={handleChange}
                    className={inputClass} placeholder="Referral source" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B — Emergency Contact & Care Providers */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <SectionHeader number="B" title="Emergency Contact & Care Providers" />
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">In Case of Emergency, We Should Notify:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input name="emergency_name" type="text" value={form.emergency_name} onChange={handleChange}
                      className={inputClass} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={labelClass}>Relationship</label>
                    <input name="emergency_relationship" type="text" value={form.emergency_relationship} onChange={handleChange}
                      className={inputClass} placeholder="e.g. Spouse, Parent" />
                  </div>
                  <div>
                    <label className={labelClass}>Day-time Phone</label>
                    <input name="emergency_phone" type="tel" value={form.emergency_phone} onChange={handleChange}
                      className={inputClass} placeholder="604-000-0000" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name of Family Doctor</label>
                  <input name="family_doctor_name" type="text" value={form.family_doctor_name} onChange={handleChange}
                    className={inputClass} placeholder="Dr. ..." />
                </div>
                <div>
                  <label className={labelClass}>Family Doctor Phone</label>
                  <input name="family_doctor_phone" type="tel" value={form.family_doctor_phone} onChange={handleChange}
                    className={inputClass} placeholder="604-000-0000" />
                </div>
                <div>
                  <label className={labelClass}>Name of Pharmacy</label>
                  <input name="pharmacy_name" type="text" value={form.pharmacy_name} onChange={handleChange}
                    className={inputClass} placeholder="Pharmacy name" />
                </div>
                <div>
                  <label className={labelClass}>Pharmacy Phone</label>
                  <input name="pharmacy_phone" type="tel" value={form.pharmacy_phone} onChange={handleChange}
                    className={inputClass} placeholder="604-000-0000" />
                </div>
              </div>

              <div className="border-t border-gray-50 pt-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Medical Specialists (if applicable)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>(1) Name of Medical Specialist</label>
                    <input name="specialist_1_name" type="text" value={form.specialist_1_name} onChange={handleChange}
                      className={inputClass} placeholder="Dr. ..." />
                  </div>
                  <div>
                    <label className={labelClass}>Area of Speciality</label>
                    <input name="specialist_1_area" type="text" value={form.specialist_1_area} onChange={handleChange}
                      className={inputClass} placeholder="e.g. Cardiology" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone or Address</label>
                    <input name="specialist_1_contact" type="text" value={form.specialist_1_contact} onChange={handleChange}
                      className={inputClass} placeholder="Contact info" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>(2) Name of Medical Specialist</label>
                    <input name="specialist_2_name" type="text" value={form.specialist_2_name} onChange={handleChange}
                      className={inputClass} placeholder="Dr. ..." />
                  </div>
                  <div>
                    <label className={labelClass}>Area of Speciality</label>
                    <input name="specialist_2_area" type="text" value={form.specialist_2_area} onChange={handleChange}
                      className={inputClass} placeholder="e.g. Oncology" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone or Address</label>
                    <input name="specialist_2_contact" type="text" value={form.specialist_2_contact} onChange={handleChange}
                      className={inputClass} placeholder="Contact info" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C — Medical History */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <SectionHeader number="C" title="Medical History Questionnaire" />
            <p className="text-sm text-gray-500 leading-relaxed mb-8 -mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              The dentist will review the questions and explain any that you do not understand. Please answer all questions.
            </p>

            <div className="space-y-0">

              {/* Q1 */}
              <QuestionRow number="1." text="Are you being treated for any medical condition at the present or have you been treated within the past year? If so, why?">
                <RadioGroup name="q1_medical_treatment" value={form.q1_medical_treatment} onChange={handleRadio} />
                {form.q1_medical_treatment === "yes" && (
                  <textarea name="q1_details" rows={2} value={form.q1_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please explain..." />
                )}
              </QuestionRow>

              {/* Q2 */}
              <QuestionRow number="2." text="When was your last medical checkup?">
                <input name="q2_last_checkup" type="text" value={form.q2_last_checkup} onChange={handleChange}
                  className={`${inputClass} max-w-xs mt-2 sm:mt-0`} placeholder="e.g. January 2024" />
              </QuestionRow>

              {/* Q3 */}
              <QuestionRow number="3." text="Has there been any change in your general health in the past year? If yes, please explain.">
                <RadioGroup name="q3_health_change" value={form.q3_health_change} onChange={handleRadio} />
                {form.q3_health_change === "yes" && (
                  <textarea name="q3_details" rows={2} value={form.q3_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please explain..." />
                )}
              </QuestionRow>

              {/* Q4 */}
              <QuestionRow number="4." text="Are you taking any medications, non-prescription drugs or herbal supplements of any kind? If yes, please list.">
                <RadioGroup name="q4_medications" value={form.q4_medications} onChange={handleRadio} />
                {form.q4_medications === "yes" && (
                  <textarea name="q4_details" rows={2} value={form.q4_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please list medications..." />
                )}
              </QuestionRow>

              {/* Q5 */}
              <QuestionRow number="5." text="Do you have any allergies? If you answered yes, please list using the categories below:">
                <RadioGroup name="q5_allergies" value={form.q5_allergies} onChange={handleRadio} />
                {form.q5_allergies === "yes" && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">a) Medications</label>
                      <input name="q5_medications" type="text" value={form.q5_medications} onChange={handleChange}
                        className={inputClass} placeholder="List medication allergies..." />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">b) Latex/rubber products</label>
                      <input name="q5_latex" type="text" value={form.q5_latex} onChange={handleChange}
                        className={inputClass} placeholder="List latex/rubber allergies..." />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">c) Other (e.g. hayfever, foods)</label>
                      <input name="q5_other" type="text" value={form.q5_other} onChange={handleChange}
                        className={inputClass} placeholder="List other allergies..." />
                    </div>
                  </div>
                )}
              </QuestionRow>

              {/* Q6 */}
              <QuestionRow number="6." text="Have you ever had a peculiar or adverse reaction to any medicines or injections? If yes, please explain.">
                <RadioGroup name="q6_adverse_reaction" value={form.q6_adverse_reaction} onChange={handleRadio} />
                {form.q6_adverse_reaction === "yes" && (
                  <textarea name="q6_details" rows={2} value={form.q6_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please explain..." />
                )}
              </QuestionRow>

              {/* Q7 */}
              <QuestionRow number="7." text="Do you have or have you ever had asthma?">
                <RadioGroup name="q7_asthma" value={form.q7_asthma} onChange={handleRadio} />
              </QuestionRow>

              {/* Q8 */}
              <QuestionRow number="8." text="Do you have or have you ever had any heart or blood pressure problems?">
                <RadioGroup name="q8_heart_blood_pressure" value={form.q8_heart_blood_pressure} onChange={handleRadio} />
              </QuestionRow>

              {/* Q9 */}
              <QuestionRow number="9." text="Do you have or have you ever had a replacement or repair of a heart valve, an infection of the heart (i.e. infective endocarditis), a heart condition from birth (i.e. congenital heart disease) or a heart transplant?">
                <RadioGroup name="q9_heart_valve_transplant" value={form.q9_heart_valve_transplant} onChange={handleRadio} />
              </QuestionRow>

              {/* Q10 */}
              <QuestionRow number="10." text="Do you have a prosthetic or artificial joint?">
                <RadioGroup name="q10_prosthetic_joint" value={form.q10_prosthetic_joint} onChange={handleRadio} />
              </QuestionRow>

              {/* Q11 */}
              <QuestionRow number="11." text="Do you have any conditions or therapies that could affect your immune system, e.g. leukemia, AIDS, HIV infection, radiotherapy, chemotherapy?">
                <RadioGroup name="q11_immune_conditions" value={form.q11_immune_conditions} onChange={handleRadio} />
              </QuestionRow>

              {/* Q12 */}
              <QuestionRow number="12." text="Have you ever had hepatitis, jaundice or liver disease?">
                <RadioGroup name="q12_hepatitis_liver" value={form.q12_hepatitis_liver} onChange={handleRadio} />
              </QuestionRow>

              {/* Q13 */}
              <QuestionRow number="13." text="Do you have a bleeding problem or bleeding disorder?">
                <RadioGroup name="q13_bleeding_disorder" value={form.q13_bleeding_disorder} onChange={handleRadio} />
              </QuestionRow>

              {/* Q14 */}
              <QuestionRow number="14." text="Have you ever been hospitalized for any illnesses or operations? If yes, please explain.">
                <RadioGroup name="q14_hospitalized" value={form.q14_hospitalized} onChange={handleRadio} />
                {form.q14_hospitalized === "yes" && (
                  <textarea name="q14_details" rows={2} value={form.q14_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please explain..." />
                )}
              </QuestionRow>
            </div>

            {/* Q15 — Conditions Checklist */}
            <div className="border-t border-gray-100 pt-6 mt-2">
              <p className="text-sm font-semibold text-navy-900 mb-4">
                <span className="font-bold">15.</span> Do you have or have you ever had any of the following? Please check.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CONDITIONS_LIST.map((condition) => (
                  <label key={condition} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.q15_conditions.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                      className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded text-teal-600 focus:ring-teal-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-navy-900 transition-colors leading-snug capitalize">
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-0 mt-2">
              {/* Q16 */}
              <QuestionRow number="16." text="Are there any conditions or diseases not listed above that you have or have had? If so, what?">
                <RadioGroup name="q16_other_conditions" value={form.q16_other_conditions} onChange={handleRadio} />
                {form.q16_other_conditions === "yes" && (
                  <textarea name="q16_details" rows={2} value={form.q16_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please describe..." />
                )}
              </QuestionRow>

              {/* Q17 */}
              <QuestionRow number="17." text="Are there any diseases or medical problems that run in your family? (e.g. diabetes, cancer or heart disease)">
                <RadioGroup name="q17_family_history" value={form.q17_family_history} onChange={handleRadio} />
                {form.q17_family_history === "yes" && (
                  <textarea name="q17_details" rows={2} value={form.q17_details} onChange={handleChange}
                    className={`${inputClass} resize-none mt-3`} placeholder="Please describe..." />
                )}
              </QuestionRow>

              {/* Q18 */}
              <QuestionRow number="18." text="Do you smoke or chew tobacco products?">
                <RadioGroup name="q18_tobacco" value={form.q18_tobacco} onChange={handleRadio} />
              </QuestionRow>

              {/* Q19 */}
              <QuestionRow number="19." text="Are you nervous during dental treatment?">
                <RadioGroup name="q19_nervous_dental" value={form.q19_nervous_dental} onChange={handleRadio} />
              </QuestionRow>

              {/* Q20 */}
              <QuestionRow number="20." text="For women only: Are you breastfeeding or pregnant? If pregnant, what is the expected delivery date?">
                <RadioGroup name="q20_pregnancy" value={form.q20_pregnancy} onChange={handleRadio} />
                {form.q20_pregnancy === "yes" && (
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Expected Delivery Date</label>
                    <input name="q20_delivery_date" type="date" value={form.q20_delivery_date} onChange={handleChange}
                      className={`${inputClass} max-w-xs`} />
                  </div>
                )}
              </QuestionRow>
            </div>
          </div>

          {/* SECTION D — Consent */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <SectionHeader number="D" title="Consent & Acknowledgement" />

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-6">
              <ol className="space-y-3 list-decimal list-inside text-sm text-gray-700 leading-relaxed">
                <li>I am aware that I will be charged $50 for any missed or cancelled appointments without 48 hours notice.</li>
                <li>I am aware that if I am excessively late for my scheduled appointment I may not be seen.</li>
                <li>I am aware that it is my responsibility as a patient to inform the office of any address, contact info or physician changes.</li>
                <li>I am aware of my insurance plan and my co-pay portion and any change in the insurance will be informed.</li>
              </ol>
            </div>

            <p className="text-sm font-semibold text-navy-900 mb-5">
              To the best of my knowledge, the above information is correct:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Patient/Parent/Guardian Signature (type full name) <span className="text-red-400">*</span>
                </label>
                <input
                  name="patient_signature" type="text" value={form.patient_signature} onChange={handleChange}
                  className={`${inputClass} ${fieldErrors.patient_signature ? "border-red-300" : ""}`}
                  placeholder="Type your full name"
                />
                {fieldErrors.patient_signature && <p className="text-xs text-red-500 mt-1">{fieldErrors.patient_signature}</p>}
              </div>
              <div>
                <label className={labelClass}>Date <span className="text-red-400">*</span></label>
                <input
                  name="signature_date" type="date" value={form.signature_date} onChange={handleChange}
                  className={`${inputClass} ${fieldErrors.signature_date ? "border-red-300" : ""}`}
                />
                {fieldErrors.signature_date && <p className="text-xs text-red-500 mt-1">{fieldErrors.signature_date}</p>}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Dentist signature will be completed in-office at your appointment.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-2xl text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Questionnaire"
            )}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            All information is strictly private and protected by doctor-patient confidentiality.
          </p>
        </form>
      </div>
    </div>
  );
}

function QuestionRow({
  number,
  text,
  children,
}: {
  number: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-800 leading-relaxed">
            <span className="font-bold text-navy-900">{number}</span> {text}
          </p>
        </div>
        <div className="sm:flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}
