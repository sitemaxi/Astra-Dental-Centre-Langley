import SEOHead from "../components/SEOHead";

const EFFECTIVE_DATE = "May 23, 2026";
const BUSINESS_NAME = "Astra Dental Centre";
const BUSINESS_ADDRESS = "Unit 120, 20061 Fraser Hwy, Langley, BC";
const CONTACT_EMAIL = "reception@astradentalcentre.com";
const CONTACT_PHONE = "604-533-8806";
const WEBSITE = "www.astradentalcentre.com";

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

export default function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms and Conditions"
        description={`Terms and Conditions for ${BUSINESS_NAME}. Please read these terms carefully before using our website or services.`}
        noIndex={false}
        canonicalPath="/terms-and-conditions/"
      />

      {/* Hero */}
      <div className="bg-navy-950 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-teal-400 text-xs font-poppins font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-poppins font-bold text-white text-4xl sm:text-5xl mb-4 leading-tight">
            Terms &amp; Conditions
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
              Welcome to <strong>{BUSINESS_NAME}</strong> ("{WEBSITE}"). By accessing or using our website,
              you agree to be bound by these Terms and Conditions. If you do not agree with any part of these
              terms, please do not use our website. These terms apply to all visitors, users, and patients who
              access or use our website.
            </p>
          </div>

          <Section number="1" title="About Us">
            <p>
              {BUSINESS_NAME} is a dental practice located at {BUSINESS_ADDRESS}. We provide dental services
              to patients in Langley, BC and the surrounding Fraser Valley region. You can reach us at{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                {CONTACT_PHONE}
              </a>{" "}
              or{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:text-teal-700 underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </Section>

          <Section number="2" title="Use of This Website">
            <p>
              This website is provided for informational purposes only. You may use our website for lawful
              purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the website in any way that violates applicable local, provincial, or federal laws or regulations.</li>
              <li>Transmit any unsolicited or unauthorized advertising or promotional material.</li>
              <li>Attempt to gain unauthorized access to any part of the website or its related systems.</li>
              <li>Use any automated means (bots, scrapers) to collect data from this website without our express written consent.</li>
              <li>Reproduce, duplicate, copy, or resell any part of our website in contravention of these terms.</li>
            </ul>
          </Section>

          <Section number="3" title="Not a Substitute for Professional Medical Advice">
            <p>
              The content on this website — including articles, blog posts, service descriptions, and
              frequently asked questions — is provided for general informational purposes only. It does not
              constitute professional dental or medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of a qualified dental or health professional with any questions you may
              have regarding a dental or medical condition. Never disregard professional advice or delay in
              seeking it because of something you have read on this website.
            </p>
          </Section>

          <Section number="4" title="Appointment Requests and Booking">
            <p>
              Submitting an appointment request through our website does not guarantee a confirmed appointment.
              Appointment requests are subject to availability and confirmation by our office. Your appointment
              is only confirmed once you receive direct confirmation from {BUSINESS_NAME} by phone or email.
            </p>
            <p>
              We ask that you provide accurate and complete information when submitting booking requests.
              Failure to do so may result in your appointment not being booked correctly.
            </p>
          </Section>

          <Section number="5" title="Intellectual Property">
            <p>
              All content on this website — including but not limited to text, images, graphics, logos,
              videos, and page layouts — is the property of {BUSINESS_NAME} or its content suppliers and is
              protected by applicable Canadian and international copyright and intellectual property laws.
            </p>
            <p>
              You may view, print, or download content from this website for your personal, non-commercial
              use only, provided you do not modify the content and you retain all copyright and proprietary
              notices.
            </p>
          </Section>

          <Section number="6" title="Third-Party Links">
            <p>
              Our website may contain links to third-party websites for your convenience and reference. These
              links do not constitute endorsement by {BUSINESS_NAME} of those websites or their content. We
              have no control over the content of those sites and accept no responsibility for them or for any
              loss or damage that may arise from your use of them.
            </p>
          </Section>

          <Section number="7" title="Disclaimer of Warranties">
            <p>
              This website is provided on an "as is" and "as available" basis without any warranties of any
              kind, either express or implied. {BUSINESS_NAME} does not warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The website will be uninterrupted, timely, secure, or error-free.</li>
              <li>The information on the website is accurate, complete, or current.</li>
              <li>Any defects in the website will be corrected.</li>
            </ul>
          </Section>

          <Section number="8" title="Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, {BUSINESS_NAME}, its staff, and its service
              providers shall not be liable for any direct, indirect, incidental, consequential, or punitive
              damages arising from your access to or use of this website or the content thereon.
            </p>
            <p>
              This limitation of liability applies regardless of the form of action and whether based on
              contract, tort (including negligence), strict liability, or otherwise, even if {BUSINESS_NAME}{" "}
              has been advised of the possibility of such damages.
            </p>
          </Section>

          <Section number="9" title="Governing Law">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the
              Province of British Columbia and the federal laws of Canada applicable therein. Any disputes
              arising under these terms shall be subject to the exclusive jurisdiction of the courts located
              in British Columbia, Canada.
            </p>
          </Section>

          <Section number="10" title="Changes to These Terms">
            <p>
              We reserve the right to update or modify these Terms and Conditions at any time without prior
              notice. Changes take effect as soon as they are posted on this page. Your continued use of the
              website after any changes constitutes your acceptance of the new terms. We encourage you to
              review this page periodically.
            </p>
          </Section>

          <Section number="11" title="Contact Us">
            <p>If you have any questions about these Terms and Conditions, please contact us:</p>
            <div className="mt-3 p-5 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="font-poppins font-semibold text-navy-900">{BUSINESS_NAME}</p>
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
          </Section>
        </div>
      </div>
    </>
  );
}
