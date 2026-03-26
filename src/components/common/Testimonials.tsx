import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
}

function formatName(full: string): string {
  const parts = full.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

const rawTestimonials: Testimonial[] = [
  {
    name: "Harry Pandher",
    text: "Dr. Potluri is an excellent dentist who truly cares about his patients! He has been my dentist for many years, and his attention to detail and gentle approach creates a welcoming environment. He takes the time to explain procedures clearly, answers questions patiently, and makes sure you feel comfortable throughout the entire visit. The office is well-organized, and the entire team is friendly and welcoming!",
  },
  {
    name: "Karyn Johansson",
    text: "My daughter and I had our first visit yesterday and I was very happy with the experience. We were both comfortable through the whole process. We had both our teeth cleaned and a checkup completed in an hours time. I learned things about my facial and teeth structure that no one had ever told me before. Though the appointment was fast, there was no rushing.",
  },
  {
    name: "su scarfe",
    text: "I'm a nervous patient. VERY nervous. But at my first visit today, I was so surprised and amazed at how gentle Dr Potluri and hygienist Helen were. And grateful! And Clara at the front desk was so sweet and understanding. I really thought my teeth were so bad that I'd have to have all my teeth ripped out and have dentures made. NOPE! The Doctor did 4 fillings and I cried when I saw the beautiful results. I am actually looking forward to my next visit.",
  },
  {
    name: "Leah Parsons",
    text: "Dr. Bhushan is a great dentist. He is caring, kind and has compassion. I have had bad experiences with dentists in the past. When I started going to see Dr Bhushan, he made me feel comfortable and at ease. My daughter also sees Dr. Bhushan and also has nothing to say but good things about him. I would highly recommend Dr. Bhushan to take care of your dental needs.",
  },
  {
    name: "Gagan Bakshi",
    text: "Dr. Bhushan is amazing. He and his staff are well trained. He is very patient and polite with his customers. He spends enough time with you. I love to go to him and all my family is his patient. I highly recommend Astra Dental for your dental needs.",
  },
  {
    name: "Navin .S",
    text: "Wonderful experience at this dental clinic! The team is welcoming and attentive, and the dentist takes time to explain everything clearly. The atmosphere is calm and comfortable, making the visit stress-free. I highly recommend their services.",
  },
  {
    name: "kal pandher",
    text: "I've had a fantastic experience with Dr. Potluri and his team! He takes his time to explain his approach and truly cares about his patients. My son got his braces done by him and the entire process was clearly explained, and we felt comfortable the entire time. Most importantly, the results spoke for themselves! The staff are kind, professional, and always take the time to answer my questions.",
  },
  {
    name: "Srinivasa Rao Kosaraju",
    text: "Highly recommended!! Mr. Dr. Potluri is incredibly skilled and truly cares for his patients. Strongly recommend Astra Dental for all dental issues. Thank you Team Astra Dental.",
  },
  {
    name: "Rosedeep Dhanoa",
    text: "Excellent experience! I get all my dental services done here the doctor is very professional, caring, and thorough. Always makes sure I'm comfortable and explains everything clearly. Highly recommend!",
  },
];

const testimonials = rawTestimonials.map((t) => ({
  ...t,
  displayName: formatName(t.name),
}));

const col1 = testimonials.slice(0, 3);
const col2 = testimonials.slice(3, 6);
const col3 = testimonials.slice(6, 9);

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="#F59E0B">
          <path d="M6 1l1.4 2.8L10.5 4.3l-2.25 2.2.53 3.1L6 8.05 3.22 9.6l.53-3.1L1.5 4.3l3.1-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsColumn({
  items,
  duration = 15,
  className = "",
}: {
  items: typeof testimonials;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5 list-none m-0 p-0"
      >
        {[0, 1].map((pass) => (
          <div key={pass} className="flex flex-col gap-5">
            {items.map((t, i) => (
              <motion.li
                key={`${pass}-${i}`}
                aria-hidden={pass === 1 ? "true" : "false"}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                className="p-6 rounded-2xl border border-navy-800/60 bg-navy-900/60 backdrop-blur-sm max-w-xs w-full cursor-default select-none"
              >
                <Stars />
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-400 text-xs font-bold">
                      {t.displayName[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">
                      {t.displayName}
                    </p>
                    <p className="text-teal-400/70 text-xs mt-0.5">Google Review</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </div>
        ))}
      </motion.ul>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Patient Stories
          </span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-3">
            What Our Patients Say
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
            Real reviews from our patients on Google. We take pride in delivering care that families in Langley trust and recommend.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-block bg-white rounded-2xl px-5 py-3 shadow-md">
              <img
                src="/Google_Review_4.9.png"
                alt="Google Reviews 4.9 stars"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn items={col1} duration={18} />
          <TestimonialsColumn items={col2} duration={22} className="hidden md:block" />
          <TestimonialsColumn items={col3} duration={20} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
