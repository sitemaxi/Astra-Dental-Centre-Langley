import SEOHead from "../components/SEOHead";

const EFFECTIVE_DATE = "May 23, 2026";
const BUSINESS_NAME = "Astra Dental Centre";
const BUSINESS_ADDRESS = "Unit 120, 20061 Fraser Hwy, Langley, BC";
const CONTACT_EMAIL = "reception@astradentalcentre.com";
const CONTACT_PHONE = "604-533-8806";

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ number, title, children }: SectionProps) {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-navy-900 text-xl mb-3 flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 text-sm font-bold flex-shrink-0 mt-0.5">
          {number}
        </span>
        {title}
      </h2>
      <div className="pl-11 text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description={`Privacy Policy for ${BUSINESS_NAME}. Learn how we collect, use, and protect your personal information in accordance with PIPEDA.`}
        noIndex={false}
        canonicalPath="/privacy-policy/"
      />

      {/* Hero */}
      <div className="bg-navy-950 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-teal-400 text-xs font-poppins font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-poppins font-bold text-white text-4xl sm:text-5xl mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-base">
            Effective date: <span className="text-gray-300">{EFFECTIVE_DATE}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <div className="mb-10 p-6 bg-teal-50 border border-teal-100 rounded-2xl">
            <p className="text-gray-700 text-sm leading-relaxed">
              At <strong>{BUSINESS_NAME}</strong>, we are committed to protecting your personal information and
              your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website or interact with our practice. We comply with the{" "}
              <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable
              provincial privacy legislation in British Columbia.
            </p>
          </div>

          <Section number="1" title="Who We Are">
            <p>
              {BUSINESS_NAME} is a dental clinic located at {BUSINESS_ADDRESS}. We are the data controller
              responsible for your personal information collected through this website and our practice.
            </p>
            <p>
              For any privacy-related inquiries, please contact our Privacy Officer at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>{" "}
              or call{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                {CONTACT_PHONE}
              </a>.
            </p>
          </Section>

          <Section number="2" title="Information We Collect">
            <p>We may collect the following categories of personal information:</p>

            <p className="font-semibold text-gray-700 mt-2">Information you provide directly:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Full name, email address, and phone number submitted via contact or booking forms</li>
              <li>Health history and medical questionnaire responses submitted through our new-patient forms</li>
              <li>Messages or inquiries you send to us</li>
            </ul>

            <p className="font-semibold text-gray-700 mt-2">Information collected automatically:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>IP address, browser type, operating system, and device type</li>
              <li>Pages visited, time spent on pages, and referring URLs</li>
              <li>Interaction data collected via cookies and tracking technologies (see Section 6)</li>
            </ul>
          </Section>

          <Section number="3" title="How We Use Your Information">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To respond to appointment requests and booking inquiries</li>
              <li>To communicate with you about your care, appointments, or questions</li>
              <li>To process and review new-patient intake forms</li>
              <li>To improve and optimize our website and services</li>
              <li>To comply with legal and regulatory obligations applicable to dental practices in BC</li>
              <li>To analyze website traffic and user behavior for marketing and improvement purposes (via Google Analytics and Google Tag Manager)</li>
            </ul>
            <p>
              We will not use your personal information for purposes other than those identified above without
              your consent.
            </p>
          </Section>

          <Section number="4" title="Legal Basis for Processing">
            <p>We process your personal information on the following bases:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Consent:</strong> Where you have provided express consent (e.g., submitting a form).</li>
              <li><strong>Contract:</strong> Where processing is necessary to fulfill an appointment or service request.</li>
              <li><strong>Legal obligation:</strong> Where we are required to retain records as a regulated dental practice under BC College of Oral Health Practitioners (COHP) standards.</li>
              <li><strong>Legitimate interests:</strong> For website analytics and improving our online presence.</li>
            </ul>
          </Section>

          <Section number="5" title="Disclosure of Your Information">
            <p>
              We do not sell or rent your personal information to third parties. We may share information with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Service providers</strong> who assist us in operating our website and business
                (e.g., hosting, email delivery, form management), subject to appropriate confidentiality
                agreements.
              </li>
              <li>
                <strong>Regulatory or legal authorities</strong> where required by law, court order, or
                professional regulatory bodies.
              </li>
              <li>
                <strong>Referral practitioners</strong> where clinically necessary and with your knowledge.
              </li>
            </ul>
            <p>
              All third-party service providers are required to use your data only for the specific purposes
              we direct and in compliance with applicable privacy law.
            </p>
          </Section>

          <Section number="6" title="Cookies and Tracking Technologies">
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience
              and collect analytics data. Specifically, we use:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Tag Manager (GTM-WCZCSHZH):</strong> A tag management system that loads
                analytics and marketing scripts on our website.
              </li>
              <li>
                <strong>Google Analytics 4 (G-P3XDSS2GYV):</strong> Collects anonymized data on how
                visitors use our website (pages visited, session duration, traffic sources). IP addresses
                are anonymized. Data is processed by Google Inc. and may be stored on servers in the United
                States. Google's Privacy Policy applies:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline underline-offset-2"
                >
                  policies.google.com/privacy
                </a>.
              </li>
              <li>
                <strong>Meta Pixel (ID: 4281497735436793):</strong> A tracking pixel operated by Meta
                Platforms, Inc. (Facebook/Instagram) that helps us measure the effectiveness of our
                advertising. Meta may use this data according to its own Data Policy:{" "}
                <a
                  href="https://www.facebook.com/privacy/policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline underline-offset-2"
                >
                  facebook.com/privacy/policy
                </a>.
              </li>
            </ul>
            <p>
              You can control or disable cookies through your browser settings. Note that disabling cookies
              may affect certain features of this website.
            </p>
          </Section>

          <Section number="7" title="Data Retention">
            <p>
              We retain personal information only as long as necessary to fulfill the purposes for which it
              was collected, or as required by law. Patient health records are retained in accordance with BC
              health records legislation (generally a minimum of 10 years from last patient contact, or until
              a minor patient reaches age 19 plus 10 years).
            </p>
            <p>
              Website analytics data is retained per Google's standard retention policies (up to 26 months
              by default for GA4).
            </p>
          </Section>

          <Section number="8" title="Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. These measures
              include secure data storage, access controls, and encrypted transmission (HTTPS).
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure, and
              we cannot guarantee absolute security.
            </p>
          </Section>

          <Section number="9" title="Your Privacy Rights">
            <p>Under PIPEDA and applicable BC privacy law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Access</strong> the personal information we hold about you.</li>
              <li><strong>Correct</strong> inaccurate or incomplete personal information.</li>
              <li><strong>Withdraw consent</strong> for processing where consent is the legal basis, subject to legal or contractual restrictions.</li>
              <li><strong>Request deletion</strong> of your personal information, subject to our legal retention obligations.</li>
              <li><strong>File a complaint</strong> with the Office of the Privacy Commissioner of Canada if you believe your rights have been violated.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us in writing at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>. We will respond within 30 days.
            </p>
          </Section>

          <Section number="10" title="Children's Privacy">
            <p>
              Our website is not directed at children under the age of 13. We do not knowingly collect
              personal information from children without verifiable parental consent. If you believe a child
              has provided us with personal information, please contact us so we can take appropriate action.
            </p>
          </Section>

          <Section number="11" title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or
              applicable law. We will indicate the effective date at the top of this page. We encourage you to
              review this policy periodically. Your continued use of this website after any changes constitutes
              your acceptance of the updated policy.
            </p>
          </Section>

          <Section number="12" title="Contact Our Privacy Officer">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="mt-3 p-5 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="font-poppins font-semibold text-navy-900">{BUSINESS_NAME} — Privacy Officer</p>
              <p>{BUSINESS_ADDRESS}</p>
              <p>
                Phone:{" "}
                <a href={`tel:${CONTACT_PHONE}`} className="text-teal-600 hover:text-teal-700">
                  {CONTACT_PHONE}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:text-teal-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              You may also contact the{" "}
              <a
                href="https://www.priv.gc.ca/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 underline underline-offset-2"
              >
                Office of the Privacy Commissioner of Canada
              </a>{" "}
              if you are not satisfied with our response.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
