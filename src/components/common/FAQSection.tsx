import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  bullets?: string[];
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label mb-4">FAQ</span>
          <h2 className="font-poppins text-3xl font-bold text-navy-900">{title}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white border-navy-100 shadow-card"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  className="w-full flex items-start justify-between px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-sm font-semibold text-navy-900 pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isOpen ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 border-t border-gray-50 pt-4">
                    {faq.answer && (
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    )}
                    {faq.bullets && faq.bullets.length > 0 && (
                      <ul className={`space-y-1.5 ${faq.answer ? "mt-3" : ""}`}>
                        {faq.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
