export interface LocationFAQ {
  question: string;
  answer: string;
}

export interface LocationData {
  slug: string;
  name: string;
  footerName: string;
  regionLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  introHeading: string;
  introParagraph: string;
  driveTime: string;
  driveRoute: string;
  directionsDetail: string;
  whyChooseParagraph: string;
  faqs: LocationFAQ[];
  ctaHeading: string;
  ctaSubtext: string;
}

export const locations: LocationData[] = [
  {
    slug: "dentist-langley",
    name: "Langley",
    footerName: "Langley, BC",
    regionLabel: "Langley, BC",
    heroTitle: "Your Trusted Dentist in Langley, BC",
    heroSubtitle: "Comprehensive dental care for the whole family — right here in Langley.",
    introHeading: "Serving the Langley Community",
    introParagraph:
      "Astra Dental Centre is conveniently located at Unit 120, 20061 Fraser Hwy in the heart of Langley. Whether you live in Langley City, Willowbrook, Walnut Grove, or anywhere else in the Township, our clinic is easy to reach and always welcoming new patients. With ample parking and flexible hours, including Saturday appointments, we've built our practice around the busy schedules of Langley families.",
    driveTime: "a short drive",
    driveRoute: "Fraser Hwy",
    directionsDetail:
      "Our clinic sits directly on Fraser Hwy near 200 St, making access simple from all parts of Langley. Whether you're coming from the north end of the Township or from Langley City, follow Fraser Hwy east or west to our clearly marked Unit 120 location with dedicated parking right at the door.",
    whyChooseParagraph:
      "Langley families choose Astra Dental Centre for the combination of advanced technology and genuinely personal care. Dr. Potluri brings years of experience treating patients of all ages — from first-time toddler check-ups to complex full-mouth restorations. We direct-bill most major insurance plans and offer flexible scheduling to keep dental care accessible and stress-free.",
    faqs: [
      {
        question: "Are you accepting new patients in Langley?",
        answer:
          "Yes! Astra Dental Centre is always welcoming new patients from Langley and all surrounding areas. You can call us at 604-533-8806 or use our online booking form to schedule your first appointment.",
      },
      {
        question: "Where exactly is Astra Dental Centre located in Langley?",
        answer:
          "We're at Unit 120, 20061 Fraser Hwy, Langley, BC — right on the main Fraser Hwy corridor with convenient on-site parking.",
      },
      {
        question: "Do you offer Invisalign in Langley?",
        answer:
          "Absolutely. Dr. Potluri is an Invisalign certified provider. We offer full Invisalign treatment for both teens and adults right here in Langley.",
      },
      {
        question: "What insurance plans do you accept?",
        answer:
          "We direct-bill most major insurance providers including Sun Life, Great-West Life, Manulife, and many others. Call us to confirm your specific plan.",
      },
      {
        question: "Is parking available at your Langley clinic?",
        answer:
          "Yes — there is ample free parking directly in front of our unit at 20061 Fraser Hwy, making every visit easy and stress-free.",
      },
    ],
    ctaHeading: "Ready to Book Your Langley Dental Appointment?",
    ctaSubtext:
      "Serving Langley families with honest, friendly, and comprehensive dental care. Call us or book online today.",
  },
  {
    slug: "dentist-willowbrook-langley",
    name: "Willowbrook",
    footerName: "Willowbrook, Langley",
    regionLabel: "Willowbrook, Langley",
    heroTitle: "Trusted Dentist Near Willowbrook, Langley",
    heroSubtitle: "Premium dental care just minutes from Willowbrook Shopping Centre.",
    introHeading: "Dental Care Near Willowbrook",
    introParagraph:
      "If you live or work near Willowbrook in Langley, Astra Dental Centre is your closest full-service dental clinic. Located at Unit 120, 20061 Fraser Hwy — just a short drive from the Willowbrook area — we serve patients from the Willowbrook neighbourhood and all of the surrounding Township. Convenient evening hours on Thursdays and Saturday appointments make it easy to fit dental care into your busy life near Willowbrook.",
    driveTime: "under 5 minutes",
    driveRoute: "Fraser Hwy heading east",
    directionsDetail:
      "From the Willowbrook Shopping Centre area, head east on Fraser Hwy. Astra Dental Centre is approximately 3 minutes along Fraser Hwy on your right side at 20061 Fraser Hwy (Unit 120). Free parking is available directly in front of the clinic.",
    whyChooseParagraph:
      "Willowbrook residents trust Astra Dental Centre because we combine a warm, welcoming atmosphere with genuinely advanced dental care. Dr. Potluri has treated Willowbrook families for years, offering everything from routine hygiene visits to Invisalign, dental implants, and cosmetic smile makeovers — all under one roof.",
    faqs: [
      {
        question: "Do you accept patients from the Willowbrook area?",
        answer:
          "Yes! We serve patients from Willowbrook and all of Langley. Our clinic at 20061 Fraser Hwy is just minutes from the Willowbrook neighbourhood.",
      },
      {
        question: "How far is Astra Dental Centre from Willowbrook?",
        answer:
          "We're approximately a 3–5 minute drive from Willowbrook Shopping Centre, heading east on Fraser Hwy to our location at 20061 Fraser Hwy.",
      },
      {
        question: "Do you offer teeth whitening near Willowbrook?",
        answer:
          "Yes — we offer professional Zoom teeth whitening and other cosmetic services at our clinic, serving patients from Willowbrook and surrounding Langley.",
      },
      {
        question: "Do you do emergency dental appointments?",
        answer:
          "We do our best to accommodate urgent dental needs. Call us at 604-533-8806 and we'll find the earliest available time for you.",
      },
      {
        question: "Is there parking near your clinic?",
        answer:
          "There is free dedicated parking directly at our Unit 120 location on Fraser Hwy — no need to search for street parking.",
      },
    ],
    ctaHeading: "Looking for a Dentist Near Willowbrook?",
    ctaSubtext:
      "Astra Dental Centre is just minutes away from Willowbrook. Book online or give us a call today.",
  },
  {
    slug: "dentist-walnut-grove-langley",
    name: "Walnut Grove",
    footerName: "Walnut Grove, Langley",
    regionLabel: "Walnut Grove, Langley",
    heroTitle: "Trusted Dentist Near Walnut Grove, Langley",
    heroSubtitle: "Friendly, modern dental care for Walnut Grove families and beyond.",
    introHeading: "Serving Walnut Grove and North Langley",
    introParagraph:
      "Astra Dental Centre warmly welcomes patients from Walnut Grove, one of Langley's most family-friendly neighbourhoods. Our clinic at Unit 120, 20061 Fraser Hwy is accessible from Walnut Grove via a straightforward drive south along 200 St or 208 St to Fraser Hwy — making us one of the most convenient dental options for Walnut Grove residents. With extended evening hours and Saturday availability, dental care fits into your schedule without the stress.",
    driveTime: "approximately 10 minutes",
    driveRoute: "south along 200 St to Fraser Hwy",
    directionsDetail:
      "From Walnut Grove, head south on 200 St or 208 St until you reach Fraser Hwy, then turn east. Astra Dental Centre is located at 20061 Fraser Hwy (Unit 120) just past the 200 St intersection. The drive is typically under 10 minutes from the heart of Walnut Grove.",
    whyChooseParagraph:
      "Walnut Grove is a community of young families, and Astra Dental Centre is designed to serve them well. We offer children's dentistry, orthodontics, preventive care, and cosmetic services — making it easy for the whole family to be seen at one trusted clinic. Dr. Potluri's caring approach ensures even nervous patients feel at ease from the moment they walk in.",
    faqs: [
      {
        question: "Do you accept patients from Walnut Grove?",
        answer:
          "Absolutely. Many of our patients drive from Walnut Grove to Astra Dental Centre on Fraser Hwy — we love treating Walnut Grove families.",
      },
      {
        question: "How long is the drive from Walnut Grove to your clinic?",
        answer:
          "It's approximately 8–10 minutes from central Walnut Grove. Head south to Fraser Hwy and we're at 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Do you offer family dentistry for Walnut Grove residents?",
        answer:
          "Yes — we provide dental care for all ages, from young children to seniors, making us a one-stop dental clinic for Walnut Grove families.",
      },
      {
        question: "Do you offer Invisalign near Walnut Grove?",
        answer:
          "Yes. Dr. Potluri is an Invisalign certified provider and we offer full Invisalign treatment for teens and adults from Walnut Grove.",
      },
      {
        question: "What are your hours? Can I book a weekend appointment?",
        answer:
          "We're open Monday–Friday and Saturdays 9 AM–3 PM. Evening appointments are available on Thursdays. Call 604-533-8806 to book.",
      },
    ],
    ctaHeading: "Serving Walnut Grove Families at Astra Dental Centre",
    ctaSubtext:
      "A short drive from Walnut Grove to quality dental care. Book your appointment online or call us today.",
  },
  {
    slug: "dentist-brookswood-langley",
    name: "Brookswood",
    footerName: "Brookswood, Langley",
    regionLabel: "Brookswood, Langley",
    heroTitle: "Trusted Dentist Near Brookswood, Langley",
    heroSubtitle: "Comfortable, comprehensive dental care serving Brookswood and south Langley.",
    introHeading: "Dental Care for Brookswood Residents",
    introParagraph:
      "Residents of Brookswood and south Langley choose Astra Dental Centre for dependable, high-quality dental care without having to travel far. Located at Unit 120, 20061 Fraser Hwy, our clinic is just minutes north of Brookswood along 200 St. From routine cleanings to dental implants and Invisalign, our full-service clinic handles everything your family needs. We're proud to serve one of Langley's most established and tight-knit communities.",
    driveTime: "approximately 10 minutes",
    driveRoute: "north on 200 St to Fraser Hwy",
    directionsDetail:
      "From Brookswood, head north on 200 St to Fraser Hwy, then turn east. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), a short distance from the 200 St and Fraser Hwy intersection. The drive from central Brookswood typically takes under 10 minutes.",
    whyChooseParagraph:
      "Brookswood is a community that values quality and trust, and that's exactly what Astra Dental Centre delivers. Dr. Potluri has earned a reputation in the broader Langley area for thorough, compassionate care. Whether you need a preventive check-up or a complete smile transformation, our modern clinic is equipped to handle it all — and your Brookswood family is always welcome.",
    faqs: [
      {
        question: "Do you serve patients from Brookswood?",
        answer:
          "Yes — we regularly see patients from Brookswood and south Langley. Our Fraser Hwy clinic is an easy drive from the Brookswood neighbourhood.",
      },
      {
        question: "How far is Astra Dental from Brookswood?",
        answer:
          "Approximately 8–10 minutes north of Brookswood. Head north on 200 St to Fraser Hwy, then east to 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Can I get dental implants near Brookswood?",
        answer:
          "Yes — dental implants are one of our specialties at Astra Dental Centre. We offer comprehensive implant consultations and placement for patients from Brookswood and all of Langley.",
      },
      {
        question: "Do you offer root canal treatment?",
        answer:
          "Yes. Our endodontic services include root canal treatment performed with modern techniques to minimize discomfort. We serve patients from Brookswood and throughout Langley.",
      },
      {
        question: "Is parking easy at your clinic?",
        answer:
          "Yes — free on-site parking is available directly at Unit 120, 20061 Fraser Hwy. No parking hassle, ever.",
      },
    ],
    ctaHeading: "Brookswood's Dental Care Team is Ready for You",
    ctaSubtext:
      "Quality dental care just a short drive from Brookswood. Call or book online today.",
  },
  {
    slug: "dentist-murrayville-langley",
    name: "Murrayville",
    footerName: "Murrayville, Langley",
    regionLabel: "Murrayville, Langley",
    heroTitle: "Trusted Dentist Near Murrayville, Langley",
    heroSubtitle: "Serving Murrayville and east Langley with expert, caring dental treatment.",
    introHeading: "Dental Care for Murrayville and East Langley",
    introParagraph:
      "Murrayville is one of Langley's most historic and charming communities, and Astra Dental Centre is proud to serve patients from this wonderful neighbourhood. Our clinic at Unit 120, 20061 Fraser Hwy is conveniently located along the Fraser Hwy corridor, making it simple for Murrayville residents to access top-tier dental care. We welcome new patients and offer a full range of services from preventive hygiene to complex restorations.",
    driveTime: "approximately 8 minutes",
    driveRoute: "west on Fraser Hwy",
    directionsDetail:
      "From Murrayville, head west on Fraser Hwy. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120) — approximately an 8-minute drive west along Fraser Hwy from the Murrayville area near 216 St. Our clinic is on the north side of Fraser Hwy with free parking.",
    whyChooseParagraph:
      "Murrayville patients appreciate that Astra Dental Centre feels like a neighbourhood practice — familiar, welcoming, and genuinely invested in your long-term dental health. Dr. Potluri takes time with every patient to explain treatment options and ensure comfort throughout. From seniors needing dentures or implants to teens starting Invisalign, we care for the whole Murrayville community.",
    faqs: [
      {
        question: "Do you accept patients from Murrayville?",
        answer:
          "Yes — we warmly welcome patients from Murrayville and east Langley. It's just an 8-minute drive west on Fraser Hwy to our clinic.",
      },
      {
        question: "How far is Astra Dental Centre from Murrayville?",
        answer:
          "About 8 minutes heading west on Fraser Hwy from central Murrayville to 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Do you offer dentures or implants for seniors in Murrayville?",
        answer:
          "Yes. We offer dentures, dental implants, and prosthodontic services for patients of all ages, including seniors from Murrayville.",
      },
      {
        question: "Do you offer Invisalign near Murrayville?",
        answer:
          "Absolutely — Dr. Potluri is Invisalign certified. Murrayville patients can start their Invisalign journey with a free consultation at our Fraser Hwy clinic.",
      },
      {
        question: "Is free parking available?",
        answer:
          "Yes. There's free dedicated parking right at our clinic entrance at Unit 120, 20061 Fraser Hwy.",
      },
    ],
    ctaHeading: "Murrayville Patients: We're Just Minutes Away",
    ctaSubtext:
      "Astra Dental Centre serves Murrayville with full-service dental care on Fraser Hwy. Book online or call today.",
  },
  {
    slug: "dentist-cloverdale-surrey",
    name: "Cloverdale",
    footerName: "Cloverdale, Surrey",
    regionLabel: "Cloverdale, Surrey",
    heroTitle: "Trusted Dentist Near Cloverdale, Surrey",
    heroSubtitle: "Just across the Langley–Surrey border — quality dental care within easy reach.",
    introHeading: "Dental Clinic Serving Cloverdale Patients",
    introParagraph:
      "Cloverdale residents looking for a great dental clinic don't have to look far. Astra Dental Centre, located at Unit 120, 20061 Fraser Hwy in Langley, is just minutes across the Surrey–Langley boundary. Many of our patients make the short trip from Cloverdale because of our advanced services, friendly team, and the ease of direct insurance billing. If you've been searching for a reliable dentist near Cloverdale, we'd love to welcome you.",
    driveTime: "approximately 10 minutes",
    driveRoute: "east on Fraser Hwy from Cloverdale",
    directionsDetail:
      "From central Cloverdale, head east on Fraser Hwy (or 64 Ave). Continue east past the Langley border and Astra Dental Centre will be on your left at 20061 Fraser Hwy (Unit 120). The drive is typically under 10 minutes from the Cloverdale town centre area.",
    whyChooseParagraph:
      "Cloverdale patients choose to drive to Astra Dental Centre because the quality of care is worth it. Dr. Potluri's experience with complex treatments — including Invisalign, dental implants, and cosmetic dentistry — attracts patients from across the Lower Mainland. Our clinic is modern, fully equipped, and staffed by a team that genuinely cares about your comfort and outcomes.",
    faqs: [
      {
        question: "Do you accept patients from Cloverdale, Surrey?",
        answer:
          "Yes — we welcome patients from Cloverdale and the broader Surrey area. Astra Dental Centre is just across the Langley border on Fraser Hwy.",
      },
      {
        question: "How far is your dental clinic from Cloverdale?",
        answer:
          "Approximately 8–10 minutes east on Fraser Hwy from central Cloverdale to our clinic at 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer Invisalign near Cloverdale?",
        answer:
          "Yes — we're an Invisalign certified provider and we treat patients from Cloverdale looking for discreet teeth straightening.",
      },
      {
        question: "Can I get a root canal at your clinic?",
        answer:
          "Absolutely. Our endodontic services include root canal treatment for patients from Cloverdale and surrounding communities.",
      },
      {
        question: "Do you direct-bill insurance for Surrey patients?",
        answer:
          "Yes — we direct-bill most major insurance plans regardless of whether you live in Langley or Surrey. Call us to confirm your plan.",
      },
    ],
    ctaHeading: "Cloverdale Residents: Great Dental Care is Minutes Away",
    ctaSubtext:
      "A short drive across the Langley border puts you at Astra Dental Centre. Book your appointment today.",
  },
  {
    slug: "dentist-white-rock",
    name: "White Rock",
    footerName: "White Rock, BC",
    regionLabel: "White Rock, BC",
    heroTitle: "Trusted Dentist Serving White Rock Patients",
    heroSubtitle: "Exceptional dental care in Langley — worth the drive from White Rock.",
    introHeading: "White Rock Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Astra Dental Centre at Unit 120, 20061 Fraser Hwy in Langley serves patients from White Rock and South Surrey who are seeking advanced dental care in a welcoming, modern environment. While we're not in White Rock itself, many of our patients make the drive from the ocean community for our comprehensive range of services — from Invisalign and dental implants to cosmetic smile design. The trip up Fraser Hwy is well worth it for the quality of care you receive.",
    driveTime: "approximately 20–25 minutes",
    driveRoute: "north on King George Blvd, then east on Fraser Hwy",
    directionsDetail:
      "From White Rock or South Surrey, head north on King George Blvd toward Surrey Central, then follow Fraser Hwy east into Langley. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20–25 minutes from the White Rock waterfront area depending on traffic.",
    whyChooseParagraph:
      "White Rock patients who visit Astra Dental Centre often tell us the drive is entirely worth it. Our clinic offers services that may not be available or as affordable closer to home — including CEREC same-day crowns, Invisalign, and comprehensive implant treatment. Dr. Potluri's thorough, patient-first approach ensures you always feel heard and cared for.",
    faqs: [
      {
        question: "Do you treat patients from White Rock?",
        answer:
          "Yes — we welcome patients from White Rock and South Surrey. Many White Rock residents choose Astra Dental Centre for our advanced services and caring team.",
      },
      {
        question: "How far is your clinic from White Rock?",
        answer:
          "Approximately 20–25 minutes north on King George Blvd, then east on Fraser Hwy to 20061 Fraser Hwy in Langley.",
      },
      {
        question: "Is Invisalign available near White Rock?",
        answer:
          "Yes. We're an Invisalign certified provider in Langley, serving patients from White Rock who want clear aligner treatment.",
      },
      {
        question: "Do you offer dental implants for White Rock patients?",
        answer:
          "Absolutely. Dental implants are a core part of our practice and we consult with and treat patients from White Rock regularly.",
      },
      {
        question: "Is free parking available at your Langley clinic?",
        answer:
          "Yes — free dedicated parking is available directly at Unit 120, 20061 Fraser Hwy.",
      },
    ],
    ctaHeading: "White Rock Patients: Premium Dental Care Awaits in Langley",
    ctaSubtext:
      "Astra Dental Centre is a short drive from White Rock — and the quality of care makes it more than worthwhile. Book online or call today.",
  },
  {
    slug: "dentist-north-delta",
    name: "North Delta",
    footerName: "North Delta, BC",
    regionLabel: "North Delta, BC",
    heroTitle: "Trusted Dentist Serving North Delta Patients",
    heroSubtitle: "Modern dental care in Langley — conveniently close to North Delta.",
    introHeading: "Dental Clinic Near North Delta",
    introParagraph:
      "North Delta residents looking for an exceptional dental clinic have found a trusted option in Astra Dental Centre, located at Unit 120, 20061 Fraser Hwy in Langley. A short drive across the Langley–Delta border puts you in one of the Lower Mainland's most modern dental clinics. From general dentistry and Invisalign to dental implants and gum treatments, we offer comprehensive care for North Delta patients of all ages.",
    driveTime: "approximately 15–20 minutes",
    driveRoute: "east on Hwy 10 / 64 Ave to Fraser Hwy",
    directionsDetail:
      "From North Delta, take Hwy 10 (64 Ave) east into Langley. Continue east past 176 St onto Fraser Hwy. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 15–20 minutes from central North Delta depending on traffic.",
    whyChooseParagraph:
      "North Delta patients choose to visit Astra Dental Centre because we offer the breadth and quality of care that's hard to find in a single clinic. Dr. Potluri is experienced across all areas of modern dentistry, and our team goes above and beyond to ensure every patient feels at ease. We direct-bill most major insurance providers, making your visit as seamless as possible.",
    faqs: [
      {
        question: "Do you accept patients from North Delta?",
        answer:
          "Yes — we welcome patients from North Delta and all of the surrounding Lower Mainland communities.",
      },
      {
        question: "How far is Astra Dental Centre from North Delta?",
        answer:
          "Approximately 15–20 minutes east on Hwy 10 / Fraser Hwy from central North Delta to our clinic at 20061 Fraser Hwy in Langley.",
      },
      {
        question: "Do you offer teeth whitening near North Delta?",
        answer:
          "Yes — we offer professional Zoom teeth whitening at our Langley clinic. North Delta patients are always welcome to book a cosmetic consultation.",
      },
      {
        question: "Can I get braces or Invisalign at your clinic?",
        answer:
          "Absolutely. We offer both traditional braces and Invisalign clear aligners at Astra Dental Centre for teens and adults from North Delta.",
      },
      {
        question: "Do you offer direct insurance billing?",
        answer:
          "Yes — we direct-bill most major insurance plans for patients from North Delta and all other communities we serve.",
      },
    ],
    ctaHeading: "North Delta Residents: Book Your Appointment Today",
    ctaSubtext:
      "Astra Dental Centre is just a short drive from North Delta — offering full-service dental care on Fraser Hwy in Langley.",
  },
  {
    slug: "dentist-aldergrove-langley",
    name: "Aldergrove",
    footerName: "Aldergrove, Langley",
    regionLabel: "Aldergrove, Langley",
    heroTitle: "Trusted Dentist Near Aldergrove, Langley",
    heroSubtitle: "Full-service dental care for Aldergrove families — just a short drive on Fraser Hwy.",
    introHeading: "Dental Care for Aldergrove and East Langley",
    introParagraph:
      "Aldergrove residents deserve a dental clinic that's modern, welcoming, and equipped to handle all their needs — and that's exactly what Astra Dental Centre offers. Located at Unit 120, 20061 Fraser Hwy in Langley, our clinic is an easy drive west along Fraser Hwy from Aldergrove. Whether you need a routine cleaning, Invisalign consultation, or same-day CEREC crown, our team is ready to serve you and your family.",
    driveTime: "approximately 10–12 minutes",
    driveRoute: "west on Fraser Hwy",
    directionsDetail:
      "From Aldergrove, head west on Fraser Hwy. Astra Dental Centre is located at 20061 Fraser Hwy (Unit 120), approximately 10–12 minutes from central Aldergrove near 272 St. Our clinic is on the north side of Fraser Hwy with free dedicated parking.",
    whyChooseParagraph:
      "Aldergrove patients value a dental practice that is honest, thorough, and convenient. At Astra Dental Centre, Dr. Potluri brings decades of experience in all areas of dentistry — from preventive hygiene to complex implant cases — to serve Aldergrove families with the care they deserve. We direct-bill most major insurance plans and offer flexible hours, including Saturdays.",
    faqs: [
      {
        question: "Do you accept patients from Aldergrove?",
        answer:
          "Yes — we warmly welcome patients from Aldergrove and east Langley. Our Fraser Hwy clinic is approximately 10 minutes west of Aldergrove.",
      },
      {
        question: "How far is Astra Dental Centre from Aldergrove?",
        answer:
          "About 10–12 minutes heading west on Fraser Hwy from central Aldergrove to our clinic at 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Do you offer family dentistry near Aldergrove?",
        answer:
          "Yes — we provide dental care for patients of all ages, from children to seniors, making Astra Dental Centre the go-to clinic for Aldergrove families.",
      },
      {
        question: "Can I get a same-day crown near Aldergrove?",
        answer:
          "Absolutely. We offer CEREC same-day ceramic crowns — no temporaries, no second appointment. Aldergrove patients love the convenience.",
      },
      {
        question: "Do you offer Saturday appointments?",
        answer:
          "Yes — we offer Saturday appointments from 9 AM to 3 PM, making it easy for Aldergrove families to fit dental care into the weekend.",
      },
    ],
    ctaHeading: "Aldergrove Patients: Quality Dental Care is Minutes Away",
    ctaSubtext:
      "A short drive west on Fraser Hwy brings you to Astra Dental Centre. Book your appointment online or call us today.",
  },
  {
    slug: "dentist-fort-langley",
    name: "Fort Langley",
    footerName: "Fort Langley, BC",
    regionLabel: "Fort Langley, BC",
    heroTitle: "Trusted Dentist Near Fort Langley, BC",
    heroSubtitle: "Heritage charm meets modern dental care — Astra Dental Centre serves Fort Langley.",
    introHeading: "Dental Care for Fort Langley Residents",
    introParagraph:
      "Fort Langley is one of the most cherished communities in the Fraser Valley, and Astra Dental Centre is proud to serve its residents. Our clinic at Unit 120, 20061 Fraser Hwy is easily accessible from Fort Langley via Glover Rd south to Fraser Hwy — typically under 10 minutes. From children's dentistry and preventive hygiene to Invisalign and dental implants, we offer comprehensive care in a welcoming, modern environment.",
    driveTime: "approximately 8–10 minutes",
    driveRoute: "south on Glover Rd to Fraser Hwy",
    directionsDetail:
      "From Fort Langley, head south on Glover Rd to Fraser Hwy, then turn west. Astra Dental Centre is located at 20061 Fraser Hwy (Unit 120), approximately 8–10 minutes from the heart of Fort Langley village. Ample free parking is available on site.",
    whyChooseParagraph:
      "Fort Langley residents appreciate a dental practice that mirrors the community's own values — quality, care, and personal attention. Dr. Potluri brings that same commitment to every patient interaction at Astra Dental Centre. Whether you're visiting for a routine check-up or a cosmetic consultation, you'll be treated with genuine warmth and expert professionalism.",
    faqs: [
      {
        question: "Do you serve patients from Fort Langley?",
        answer:
          "Yes — Fort Langley residents are always welcome at Astra Dental Centre. It's just a short 8–10 minute drive south on Glover Rd to Fraser Hwy.",
      },
      {
        question: "How do I get to your clinic from Fort Langley?",
        answer:
          "Head south on Glover Rd to Fraser Hwy, then turn west. We're at 20061 Fraser Hwy, Unit 120 — approximately 10 minutes from Fort Langley village.",
      },
      {
        question: "Do you offer cosmetic dentistry for Fort Langley patients?",
        answer:
          "Yes — we offer teeth whitening, Invisalign, veneers, and full smile makeovers for patients from Fort Langley.",
      },
      {
        question: "Is parking available?",
        answer:
          "Yes — free dedicated on-site parking is available at Unit 120, 20061 Fraser Hwy. Easy in, easy out.",
      },
      {
        question: "Do you accept new patients from Fort Langley?",
        answer:
          "Absolutely — we are always accepting new patients from Fort Langley and the surrounding areas. Call 604-533-8806 or book online.",
      },
    ],
    ctaHeading: "Fort Langley Families: Your Dental Team Awaits",
    ctaSubtext:
      "Astra Dental Centre is just a short drive from Fort Langley. Modern care, warm atmosphere — book today.",
  },
  {
    slug: "dentist-abbotsford",
    name: "Abbotsford",
    footerName: "Abbotsford, BC",
    regionLabel: "Abbotsford, BC",
    heroTitle: "Trusted Dentist Serving Abbotsford Patients",
    heroSubtitle: "Quality dental care in Langley — a comfortable drive from Abbotsford.",
    introHeading: "Welcoming Abbotsford Patients at Astra Dental Centre",
    introParagraph:
      "Patients from Abbotsford looking for advanced dental care often make the drive to Astra Dental Centre at Unit 120, 20061 Fraser Hwy in Langley. Our full-service clinic offers treatments that are sometimes difficult to access locally — including CEREC same-day crowns, Invisalign, dental implants, and comprehensive cosmetic dentistry. Dr. Potluri and the team at Astra Dental Centre provide the exceptional care that Abbotsford patients have come to trust.",
    driveTime: "approximately 25–30 minutes",
    driveRoute: "west on Trans-Canada Hwy (Hwy 1) to Langley",
    directionsDetail:
      "From Abbotsford, take Trans-Canada Hwy (Hwy 1) west toward Langley. Exit at 200 St / Langley and head north to Fraser Hwy, then turn west. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 25–30 minutes from central Abbotsford.",
    whyChooseParagraph:
      "Abbotsford patients who visit Astra Dental Centre consistently tell us the drive is worthwhile. Our clinic is equipped with the latest technology — from digital X-rays to CEREC CAD/CAM milling — and Dr. Potluri's depth of experience across all areas of dentistry means fewer referrals and more convenience for you. We direct-bill insurance and offer flexible scheduling.",
    faqs: [
      {
        question: "Do you accept patients from Abbotsford?",
        answer:
          "Yes — we welcome patients from Abbotsford and the broader Fraser Valley. Many Abbotsford residents make the drive to Astra Dental Centre for our advanced services.",
      },
      {
        question: "How far is your clinic from Abbotsford?",
        answer:
          "Approximately 25–30 minutes west on Trans-Canada Hwy (Hwy 1) from central Abbotsford to our clinic at 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer CEREC same-day crowns near Abbotsford?",
        answer:
          "Yes — CEREC same-day crowns are one of our signature services. No temporary crowns, no second visit — ideal for patients coming from Abbotsford.",
      },
      {
        question: "Is Invisalign available for Abbotsford residents?",
        answer:
          "Absolutely. Dr. Potluri is Invisalign certified and offers full Invisalign treatment for teens and adults from Abbotsford.",
      },
      {
        question: "Do you direct-bill insurance for Abbotsford patients?",
        answer:
          "Yes — we direct-bill most major insurance plans regardless of your location, including patients from Abbotsford.",
      },
    ],
    ctaHeading: "Abbotsford Patients: Advanced Dental Care in Langley",
    ctaSubtext:
      "A comfortable drive from Abbotsford leads you to exceptional dental care at Astra Dental Centre. Book online or call today.",
  },
  {
    slug: "dentist-maple-ridge",
    name: "Maple Ridge",
    footerName: "Maple Ridge, BC",
    regionLabel: "Maple Ridge, BC",
    heroTitle: "Trusted Dentist Serving Maple Ridge Patients",
    heroSubtitle: "Expert dental care in Langley — accessible from Maple Ridge via Golden Ears Bridge.",
    introHeading: "Maple Ridge Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Maple Ridge residents seeking a high-quality dental clinic can conveniently reach Astra Dental Centre via the Golden Ears Bridge. Located at Unit 120, 20061 Fraser Hwy in Langley, our clinic offers the kind of comprehensive, technology-forward dental care that Maple Ridge families deserve. From general dentistry and orthodontics to implants and cosmetic procedures, everything is available under one roof.",
    driveTime: "approximately 20–25 minutes",
    driveRoute: "south via Golden Ears Bridge to Fraser Hwy",
    directionsDetail:
      "From Maple Ridge, cross the Golden Ears Bridge south toward Langley. Follow 208 St south to Fraser Hwy, then turn east. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20–25 minutes from central Maple Ridge depending on traffic.",
    whyChooseParagraph:
      "Maple Ridge patients who visit Astra Dental Centre appreciate the full spectrum of services we offer in one accessible location. Dr. Potluri's extensive training and use of leading-edge technology — including CEREC, Invisalign, and digital imaging — means you can get more done with fewer appointments. We direct-bill most insurance plans and always welcome new patients.",
    faqs: [
      {
        question: "Do you accept patients from Maple Ridge?",
        answer:
          "Yes — we welcome patients from Maple Ridge. It's approximately 20–25 minutes via the Golden Ears Bridge to our Langley clinic.",
      },
      {
        question: "How do I get from Maple Ridge to your clinic?",
        answer:
          "Cross the Golden Ears Bridge south, follow 208 St to Fraser Hwy and turn east. We're at 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Do you offer dental implants for Maple Ridge patients?",
        answer:
          "Yes — dental implants are a core service at Astra Dental Centre. Maple Ridge patients regularly visit us for implant consultations and placement.",
      },
      {
        question: "Can I book a Saturday appointment?",
        answer:
          "Yes — we offer Saturday appointments from 9 AM to 3 PM, making the trip from Maple Ridge even more convenient.",
      },
      {
        question: "Do you accept new patients from Maple Ridge?",
        answer:
          "Absolutely — we're always accepting new patients. Call 604-533-8806 or use our online booking form to get started.",
      },
    ],
    ctaHeading: "Maple Ridge: Great Dental Care is a Short Bridge Away",
    ctaSubtext:
      "Cross the Golden Ears Bridge and arrive at Astra Dental Centre in Langley. Book your appointment online or call today.",
  },
  {
    slug: "dentist-surrey",
    name: "Surrey",
    footerName: "Surrey, BC",
    regionLabel: "Surrey, BC",
    heroTitle: "Trusted Dentist Near Surrey, BC",
    heroSubtitle: "Serving Surrey patients with comprehensive dental care just across the Langley border.",
    introHeading: "Surrey Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Patients across Surrey looking for a trusted, full-service dental clinic find a top-tier option at Astra Dental Centre, located at Unit 120, 20061 Fraser Hwy in Langley. Just minutes east of the Surrey–Langley boundary, our clinic is easily accessible from Newton, Fleetwood, South Surrey, and other Surrey neighbourhoods. We offer everything from routine hygiene and children's dentistry to dental implants, Invisalign, and cosmetic smile design.",
    driveTime: "approximately 15–20 minutes",
    driveRoute: "east on Fraser Hwy / 64 Ave",
    directionsDetail:
      "From most Surrey neighbourhoods, head east on Fraser Hwy or 64 Ave. Continue east past the Surrey–Langley boundary. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 15–20 minutes from central Surrey. Free parking is available on site.",
    whyChooseParagraph:
      "Surrey patients choose Astra Dental Centre because of the quality and range of services we offer. Dr. Potluri is experienced in all areas of modern dentistry, from complex restorations and implants to Invisalign and cosmetic procedures. Our friendly team, advanced technology, and direct insurance billing make every visit as convenient and comfortable as possible.",
    faqs: [
      {
        question: "Do you accept patients from Surrey?",
        answer:
          "Yes — we welcome patients from across Surrey. Our Langley clinic is just east of the Surrey border on Fraser Hwy.",
      },
      {
        question: "How long is the drive from Surrey to your clinic?",
        answer:
          "Approximately 15–20 minutes east on Fraser Hwy / 64 Ave from central Surrey to 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer Invisalign near Surrey?",
        answer:
          "Yes — we're an Invisalign certified provider serving patients from Surrey and the broader Lower Mainland.",
      },
      {
        question: "Do you take emergency appointments for Surrey patients?",
        answer:
          "We do our best to accommodate urgent dental needs. Call 604-533-8806 and we'll get you in as soon as possible.",
      },
      {
        question: "Do you direct-bill insurance for Surrey patients?",
        answer:
          "Yes — we direct-bill most major insurance plans for all patients, including those from Surrey.",
      },
    ],
    ctaHeading: "Surrey Patients: Exceptional Dental Care is Nearby",
    ctaSubtext:
      "Astra Dental Centre is just across the Langley border — offering full-service dental care on Fraser Hwy. Book today.",
  },
  {
    slug: "dentist-burnaby",
    name: "Burnaby",
    footerName: "Burnaby, BC",
    regionLabel: "Burnaby, BC",
    heroTitle: "Trusted Dentist Serving Burnaby Patients",
    heroSubtitle: "Premium dental care in Langley — a worthwhile drive from Burnaby.",
    introHeading: "Burnaby Patients Choose Astra Dental Centre",
    introParagraph:
      "Burnaby residents who demand the best in dental care make the trip to Astra Dental Centre at Unit 120, 20061 Fraser Hwy in Langley. Our clinic offers advanced treatments including CEREC same-day crowns, dental implants, Invisalign, and comprehensive cosmetic dentistry — all with the kind of personal, attentive care that's hard to find in busier urban clinics. If you're looking for a dentist who truly listens and uses the latest technology, Astra Dental Centre is worth the drive from Burnaby.",
    driveTime: "approximately 35–45 minutes",
    driveRoute: "east on Hwy 1 to Langley",
    directionsDetail:
      "From Burnaby, take Hwy 1 (Trans-Canada) east toward Langley. Exit at 200 St in Langley and head south to Fraser Hwy. Turn east on Fraser Hwy — Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 35–45 minutes from central Burnaby depending on traffic.",
    whyChooseParagraph:
      "Burnaby patients who visit Astra Dental Centre consistently remark on the difference in experience — unhurried appointments, thorough explanations, and treatment that's tailored to your specific needs. Dr. Potluri's use of advanced technology like CEREC, digital X-rays, and Invisalign ClinCheck means better outcomes and fewer appointments. We direct-bill insurance and offer flexible scheduling.",
    faqs: [
      {
        question: "Do you accept patients from Burnaby?",
        answer:
          "Yes — we welcome patients from Burnaby and the Greater Vancouver area who are looking for advanced, personalized dental care in Langley.",
      },
      {
        question: "How far is your clinic from Burnaby?",
        answer:
          "Approximately 35–45 minutes east on Hwy 1 from central Burnaby to our clinic at 20061 Fraser Hwy in Langley.",
      },
      {
        question: "Is CEREC same-day crown available for Burnaby patients?",
        answer:
          "Yes — CEREC same-day crowns mean no temporary crown and no second visit. Ideal for patients making the drive from Burnaby.",
      },
      {
        question: "Do you offer cosmetic dentistry for Burnaby patients?",
        answer:
          "Absolutely. We offer Invisalign, teeth whitening, veneers, and smile makeovers for patients from Burnaby and across the Lower Mainland.",
      },
      {
        question: "Is parking easy at your Langley clinic?",
        answer:
          "Yes — free dedicated parking is right at our clinic entrance at Unit 120, 20061 Fraser Hwy. No parking stress.",
      },
    ],
    ctaHeading: "Burnaby Patients: Premium Dental Care in Langley Awaits",
    ctaSubtext:
      "The drive from Burnaby to Astra Dental Centre is worth every minute. Book your appointment online or call today.",
  },
  {
    slug: "dentist-clayton-heights-surrey",
    name: "Clayton Heights",
    footerName: "Clayton Heights, Surrey",
    regionLabel: "Clayton Heights, Surrey",
    heroTitle: "Trusted Dentist Near Clayton Heights, Surrey",
    heroSubtitle: "Full-service dental care for Clayton Heights families — just minutes west on Fraser Hwy.",
    introHeading: "Dental Care for Clayton Heights Residents",
    introParagraph:
      "Clayton Heights is one of Surrey's fastest-growing communities, and Astra Dental Centre is proud to serve its families with comprehensive, high-quality dental care. Our clinic at Unit 120, 20061 Fraser Hwy in Langley is an easy drive west from Clayton Heights — typically 10 to 15 minutes. From routine checkups and children's dentistry to Invisalign, CEREC same-day crowns, and dental implants, we offer everything your family needs under one roof.",
    driveTime: "approximately 10–15 minutes",
    driveRoute: "west on Fraser Hwy",
    directionsDetail:
      "From Clayton Heights, head west on Fraser Hwy toward Langley. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 10–15 minutes from the Clayton/Langley border. Free dedicated on-site parking is available.",
    whyChooseParagraph:
      "Clayton Heights families trust Astra Dental Centre for consistent, thorough care. Dr. Potluri combines decades of clinical experience with the latest dental technology — including CEREC CAD/CAM, digital X-rays, and Invisalign ClinCheck — to deliver outstanding results. We direct-bill most major insurance providers and offer Saturday appointments for added convenience.",
    faqs: [
      {
        question: "Do you accept patients from Clayton Heights, Surrey?",
        answer:
          "Yes — Clayton Heights residents are welcome at Astra Dental Centre. We're approximately 10–15 minutes west on Fraser Hwy from Clayton Heights.",
      },
      {
        question: "How do I get to your clinic from Clayton Heights?",
        answer:
          "Head west on Fraser Hwy from Clayton Heights. We're at 20061 Fraser Hwy, Unit 120, Langley — with free parking on site.",
      },
      {
        question: "Do you offer family dentistry near Clayton Heights?",
        answer:
          "Yes — we provide comprehensive dental care for patients of all ages, from toddlers to seniors, serving Clayton Heights families.",
      },
      {
        question: "Can I get Invisalign near Clayton Heights?",
        answer:
          "Absolutely. Dr. Potluri is Invisalign certified and offers full treatment for teens and adults from Clayton Heights.",
      },
      {
        question: "Do you offer Saturday appointments?",
        answer:
          "Yes — Saturday appointments are available from 9 AM to 3 PM, perfect for busy Clayton Heights families.",
      },
    ],
    ctaHeading: "Clayton Heights: Quality Dental Care is Minutes Away",
    ctaSubtext:
      "A short drive west on Fraser Hwy brings you to Astra Dental Centre. Book online or call today.",
  },
  {
    slug: "dentist-fleetwood-surrey",
    name: "Fleetwood",
    footerName: "Fleetwood, Surrey",
    regionLabel: "Fleetwood, Surrey",
    heroTitle: "Trusted Dentist Near Fleetwood, Surrey",
    heroSubtitle: "Modern dental care in Langley — easily accessible from Fleetwood, Surrey.",
    introHeading: "Dental Care for Fleetwood, Surrey Residents",
    introParagraph:
      "Fleetwood residents looking for a trusted dental clinic with advanced technology and attentive care choose Astra Dental Centre. Located at Unit 120, 20061 Fraser Hwy in Langley, our clinic is approximately 15 minutes from Fleetwood via Fraser Hwy heading east. We offer full-service dentistry — from preventive cleanings and children's care to dental implants, cosmetic procedures, and CEREC same-day crowns — all without the need for multiple referrals.",
    driveTime: "approximately 15 minutes",
    driveRoute: "east on Fraser Hwy",
    directionsDetail:
      "From Fleetwood, head east on Fraser Hwy toward Langley. Continue past 168 St and across the Surrey–Langley boundary. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 15 minutes from central Fleetwood.",
    whyChooseParagraph:
      "Fleetwood patients who make the short trip to Astra Dental Centre consistently appreciate our thorough, unhurried approach to dentistry. Dr. Potluri takes the time to understand your dental goals and uses the latest technology to achieve them — whether that's a seamless same-day crown, a straighter smile with Invisalign, or a complete oral health assessment.",
    faqs: [
      {
        question: "Do you accept patients from Fleetwood, Surrey?",
        answer:
          "Yes — Fleetwood residents are welcome at Astra Dental Centre. We're approximately 15 minutes east on Fraser Hwy.",
      },
      {
        question: "How far is the drive from Fleetwood to your clinic?",
        answer:
          "About 15 minutes east on Fraser Hwy from central Fleetwood to our clinic at 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer CEREC crowns for Fleetwood patients?",
        answer:
          "Yes — CEREC same-day ceramic crowns mean one appointment, no temporaries, and a permanent result. Ideal for Fleetwood patients.",
      },
      {
        question: "Can I direct-bill my insurance?",
        answer:
          "Yes — we direct-bill most major BC insurance plans, making it seamless for Fleetwood patients.",
      },
      {
        question: "Do you take new patients from Fleetwood?",
        answer:
          "Absolutely — we're always welcoming new patients from Fleetwood and Surrey. Call 604-533-8806 or book online.",
      },
    ],
    ctaHeading: "Fleetwood Patients: Great Dental Care Awaits in Langley",
    ctaSubtext:
      "Just 15 minutes east on Fraser Hwy brings you to Astra Dental Centre. Book your appointment today.",
  },
  {
    slug: "dentist-guildford-surrey",
    name: "Guildford",
    footerName: "Guildford, Surrey",
    regionLabel: "Guildford, Surrey",
    heroTitle: "Trusted Dentist Near Guildford, Surrey",
    heroSubtitle: "Exceptional dental care in Langley — a comfortable drive from Guildford, Surrey.",
    introHeading: "Welcoming Guildford Patients at Astra Dental Centre",
    introParagraph:
      "Guildford is one of Surrey's most vibrant communities, and Astra Dental Centre is proud to serve its residents with world-class dental care. Our clinic at Unit 120, 20061 Fraser Hwy in Langley is roughly 20 minutes east of Guildford Town Centre — a short, convenient drive for families seeking comprehensive dental services. From routine hygiene appointments to full-arch implant restorations and Invisalign treatment, we handle it all in one location.",
    driveTime: "approximately 20 minutes",
    driveRoute: "east on Fraser Hwy",
    directionsDetail:
      "From Guildford Town Centre, head east on Fraser Hwy / 104 Ave toward Langley. Continue past the Surrey–Langley border. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20 minutes from central Guildford.",
    whyChooseParagraph:
      "Guildford patients choose Astra Dental Centre for the breadth of our services and the depth of Dr. Potluri's expertise. Whether you need a routine cleaning or a complex restorative procedure, you'll receive personalized care with the latest dental technology. We direct-bill insurance and offer weekend appointments.",
    faqs: [
      {
        question: "Do you accept patients from Guildford, Surrey?",
        answer:
          "Yes — we welcome Guildford patients. Astra Dental Centre is approximately 20 minutes east of Guildford on Fraser Hwy.",
      },
      {
        question: "How do I get to your clinic from Guildford?",
        answer:
          "Head east on Fraser Hwy from Guildford. We're at 20061 Fraser Hwy, Unit 120, Langley — about 20 minutes from Guildford Town Centre.",
      },
      {
        question: "Do you offer dental implants near Guildford?",
        answer:
          "Yes — dental implants are among our core services. Guildford patients come to us for consultations, implant placement, and implant-supported restorations.",
      },
      {
        question: "Is Invisalign available for Guildford patients?",
        answer:
          "Absolutely. We're Invisalign certified and serve patients from Guildford and across Surrey with full Invisalign treatment.",
      },
      {
        question: "Do you offer weekend appointments?",
        answer:
          "Yes — Saturday appointments are available from 9 AM to 3 PM for Guildford and Surrey patients.",
      },
    ],
    ctaHeading: "Guildford Patients: Exceptional Dental Care in Langley",
    ctaSubtext:
      "A 20-minute drive east on Fraser Hwy leads to outstanding dental care at Astra Dental Centre. Book today.",
  },
  {
    slug: "dentist-south-surrey",
    name: "South Surrey",
    footerName: "South Surrey, BC",
    regionLabel: "South Surrey, BC",
    heroTitle: "Trusted Dentist Serving South Surrey Patients",
    heroSubtitle: "Comprehensive dental care in Langley — accessible from South Surrey and White Rock.",
    introHeading: "South Surrey Patients Welcome at Astra Dental Centre",
    introParagraph:
      "South Surrey and White Rock residents looking for a full-service dental clinic with advanced technology find Astra Dental Centre worth the drive. Located at Unit 120, 20061 Fraser Hwy in Langley, our clinic is approximately 25 minutes from South Surrey via Hwy 10 heading east. We provide a complete range of dental services — from family cleanings and children's dentistry to dental implants, Invisalign, and cosmetic smile design — in a welcoming, state-of-the-art environment.",
    driveTime: "approximately 25 minutes",
    driveRoute: "east on Hwy 10 / 64 Ave to Fraser Hwy",
    directionsDetail:
      "From South Surrey, head east on Hwy 10 (56 Ave) or 64 Ave toward Langley. Turn north onto 200 St and then east on Fraser Hwy, or continue on Hwy 10 to Fraser Hwy directly. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 25 minutes from South Surrey.",
    whyChooseParagraph:
      "South Surrey patients who come to Astra Dental Centre appreciate the all-in-one convenience and quality of care that's hard to match locally. Dr. Potluri's expertise spans the full spectrum of modern dentistry, and our use of CEREC, digital imaging, and Invisalign means you spend less time in the chair and get better results. We direct-bill insurance and always welcome new patients.",
    faqs: [
      {
        question: "Do you accept patients from South Surrey?",
        answer:
          "Yes — South Surrey residents are always welcome. Astra Dental Centre is approximately 25 minutes northeast via Hwy 10.",
      },
      {
        question: "How do I get from South Surrey to your clinic?",
        answer:
          "Take Hwy 10 east to 200 St, then north to Fraser Hwy east. We're at 20061 Fraser Hwy, Unit 120, Langley — about 25 minutes.",
      },
      {
        question: "Do you offer cosmetic dentistry for South Surrey patients?",
        answer:
          "Yes — teeth whitening, Invisalign, veneers, and smile makeovers are available for South Surrey and White Rock residents.",
      },
      {
        question: "Can I get a same-day crown near South Surrey?",
        answer:
          "Yes — CEREC same-day crowns mean you leave with a permanent ceramic crown in a single visit. No temporary needed.",
      },
      {
        question: "Do you direct-bill insurance for South Surrey patients?",
        answer:
          "Yes — we direct-bill most major insurance plans, making billing seamless for all patients including those from South Surrey.",
      },
    ],
    ctaHeading: "South Surrey: Advanced Dental Care in Nearby Langley",
    ctaSubtext:
      "Astra Dental Centre is a comfortable drive from South Surrey. Book your appointment online or call today.",
  },
  {
    slug: "dentist-panorama-ridge-surrey",
    name: "Panorama Ridge",
    footerName: "Panorama Ridge, Surrey",
    regionLabel: "Panorama Ridge, Surrey",
    heroTitle: "Trusted Dentist Near Panorama Ridge, Surrey",
    heroSubtitle: "Premium dental care in Langley — convenient for Panorama Ridge residents.",
    introHeading: "Dental Care for Panorama Ridge, Surrey",
    introParagraph:
      "Panorama Ridge residents in Surrey have a trusted dental home at Astra Dental Centre, located at Unit 120, 20061 Fraser Hwy in Langley. Just 15 to 20 minutes from Panorama Ridge via Fraser Hwy heading east, our clinic offers the comprehensive services and caring environment that Surrey families deserve. From preventive care and orthodontics to restorations and implants, everything is available in one convenient location.",
    driveTime: "approximately 15–20 minutes",
    driveRoute: "east on Fraser Hwy",
    directionsDetail:
      "From Panorama Ridge, head east on Fraser Hwy toward Langley. Continue past the Surrey–Langley border to 20061 Fraser Hwy (Unit 120). The drive is approximately 15–20 minutes from central Panorama Ridge.",
    whyChooseParagraph:
      "Panorama Ridge patients appreciate Astra Dental Centre's commitment to quality and efficiency. Our CEREC technology means same-day crowns, our Invisalign expertise means straighter smiles without bulky braces, and our comprehensive approach means fewer referrals. Dr. Potluri and the team make every visit straightforward and stress-free.",
    faqs: [
      {
        question: "Do you accept patients from Panorama Ridge?",
        answer:
          "Yes — Panorama Ridge residents are welcome. We're approximately 15–20 minutes east on Fraser Hwy from Panorama Ridge.",
      },
      {
        question: "How long is the drive from Panorama Ridge to Astra Dental Centre?",
        answer:
          "About 15–20 minutes heading east on Fraser Hwy to 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer Invisalign near Panorama Ridge?",
        answer:
          "Yes — Dr. Potluri is Invisalign certified and serves Panorama Ridge patients with full orthodontic treatment.",
      },
      {
        question: "Do you take new patients from Panorama Ridge?",
        answer:
          "Absolutely — we're always welcoming new patients from Panorama Ridge and all Surrey neighbourhoods.",
      },
      {
        question: "Are Saturday appointments available?",
        answer:
          "Yes — Saturday hours from 9 AM to 3 PM make it easy for Panorama Ridge families to fit dental care into the weekend.",
      },
    ],
    ctaHeading: "Panorama Ridge: Your Dental Team is Just Down Fraser Hwy",
    ctaSubtext:
      "Astra Dental Centre is just east of Surrey on Fraser Hwy. Book your appointment online or call today.",
  },
  {
    slug: "dentist-newton-surrey",
    name: "Newton",
    footerName: "Newton, Surrey",
    regionLabel: "Newton, Surrey",
    heroTitle: "Trusted Dentist Near Newton, Surrey",
    heroSubtitle: "Comprehensive dental care in Langley — serving Newton, Surrey families.",
    introHeading: "Newton, Surrey Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Newton is one of Surrey's most established communities, and Astra Dental Centre is pleased to serve its residents with full-service dental care. Our clinic at Unit 120, 20061 Fraser Hwy in Langley is approximately 20 minutes from Newton via Fraser Hwy heading east. Whether you're looking for a new family dentist, need a same-day crown, or are considering Invisalign, Astra Dental Centre provides a complete dental experience in a welcoming, modern setting.",
    driveTime: "approximately 20 minutes",
    driveRoute: "east on Fraser Hwy / 64 Ave",
    directionsDetail:
      "From Newton, head east on Fraser Hwy or 64 Ave toward Langley. Continue past the Surrey–Langley boundary. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20 minutes from central Newton.",
    whyChooseParagraph:
      "Newton patients choose Astra Dental Centre because we offer something increasingly rare — a dental clinic where every patient receives unhurried, personalized attention backed by advanced technology. Dr. Potluri's decades of experience and use of tools like CEREC and Invisalign ClinCheck mean better outcomes and a smoother experience. We direct-bill insurance and always accept new patients.",
    faqs: [
      {
        question: "Do you serve patients from Newton, Surrey?",
        answer:
          "Yes — Newton residents are warmly welcome at Astra Dental Centre. We're approximately 20 minutes east on Fraser Hwy.",
      },
      {
        question: "How far is the drive from Newton to your Langley clinic?",
        answer:
          "About 20 minutes east on Fraser Hwy from Newton, Surrey to 20061 Fraser Hwy, Langley.",
      },
      {
        question: "Do you offer children's dentistry near Newton?",
        answer:
          "Yes — we provide gentle, patient dental care for children from Newton and all Surrey neighbourhoods.",
      },
      {
        question: "Do you accept dental insurance from Newton residents?",
        answer:
          "Yes — we direct-bill most major insurance plans for all patients, including those from Newton, Surrey.",
      },
      {
        question: "Can I book online from Newton?",
        answer:
          "Absolutely — our online booking is available 24/7 for Newton and all other patients.",
      },
    ],
    ctaHeading: "Newton, Surrey: Excellent Dental Care is East on Fraser Hwy",
    ctaSubtext:
      "Astra Dental Centre is just a 20-minute drive from Newton, Surrey. Book your appointment today.",
  },
  {
    slug: "dentist-ocean-park-surrey",
    name: "Ocean Park",
    footerName: "Ocean Park, Surrey",
    regionLabel: "Ocean Park, Surrey",
    heroTitle: "Trusted Dentist Near Ocean Park, Surrey",
    heroSubtitle: "Premium dental care in Langley — serving Ocean Park and South Surrey.",
    introHeading: "Ocean Park Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Ocean Park is a beautiful seaside community in South Surrey, and Astra Dental Centre is delighted to serve its residents with top-tier dental care. Our clinic at Unit 120, 20061 Fraser Hwy in Langley is approximately 25–30 minutes from Ocean Park via Hwy 10 or King George Blvd heading east. We offer the full spectrum of dental services — from family hygiene and children's dentistry to dental implants, cosmetic procedures, and Invisalign — in a modern, comfortable setting.",
    driveTime: "approximately 25–30 minutes",
    driveRoute: "east on Hwy 10 or King George Blvd to Fraser Hwy",
    directionsDetail:
      "From Ocean Park, head north on King George Blvd or east on Hwy 10 toward Langley. Connect to Fraser Hwy heading east. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 25–30 minutes from Ocean Park.",
    whyChooseParagraph:
      "Ocean Park patients who visit Astra Dental Centre find that the drive is well worth it. Our clinic combines Dr. Potluri's extensive experience with leading-edge technology — CEREC same-day crowns, Invisalign ClinCheck, and digital imaging — to deliver exceptional results in fewer appointments. We offer flexible scheduling including Saturdays and direct-bill most insurance plans.",
    faqs: [
      {
        question: "Do you accept patients from Ocean Park, Surrey?",
        answer:
          "Yes — Ocean Park residents are always welcome. Astra Dental Centre is approximately 25–30 minutes via Hwy 10 or King George Blvd.",
      },
      {
        question: "How do I get from Ocean Park to your clinic?",
        answer:
          "Head east on Hwy 10 or north on King George Blvd to connect to Fraser Hwy east. We're at 20061 Fraser Hwy, Unit 120, Langley.",
      },
      {
        question: "Do you offer cosmetic dentistry for Ocean Park patients?",
        answer:
          "Yes — Invisalign, teeth whitening, veneers, and smile makeovers are available for Ocean Park and South Surrey residents.",
      },
      {
        question: "Do you do CEREC same-day crowns near Ocean Park?",
        answer:
          "Yes — CEREC crowns mean a single appointment with no temporary crown. Ideal for Ocean Park patients making the trip.",
      },
      {
        question: "Are weekend appointments available for Ocean Park patients?",
        answer:
          "Yes — Saturday appointments from 9 AM to 3 PM make the drive from Ocean Park even more practical.",
      },
    ],
    ctaHeading: "Ocean Park: World-Class Dental Care in Nearby Langley",
    ctaSubtext:
      "A comfortable drive from Ocean Park brings you to Astra Dental Centre. Book online or call today.",
  },
  {
    slug: "dentist-ladner",
    name: "Ladner",
    footerName: "Ladner, BC",
    regionLabel: "Ladner, BC",
    heroTitle: "Trusted Dentist Serving Ladner Patients",
    heroSubtitle: "Exceptional dental care in Langley — conveniently reachable from Ladner.",
    introHeading: "Ladner Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Ladner residents who want access to advanced dental technology and comprehensive care choose Astra Dental Centre at Unit 120, 20061 Fraser Hwy in Langley. Just 20–25 minutes from Ladner via Hwy 17 and Hwy 10, our clinic offers the full range of dental services — from preventive hygiene and children's dentistry to CEREC same-day crowns, dental implants, Invisalign, and cosmetic smile makeovers — all under one roof.",
    driveTime: "approximately 20–25 minutes",
    driveRoute: "north on Hwy 17 to Hwy 10 east, connecting to Fraser Hwy",
    directionsDetail:
      "From Ladner, head north on Hwy 17 to Hwy 10, then east toward Langley. Connect to 200 St north and then east on Fraser Hwy, or follow Hwy 10 to the Langley area. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20–25 minutes from Ladner.",
    whyChooseParagraph:
      "Ladner patients appreciate the full-service capability and personal attention they receive at Astra Dental Centre. Dr. Potluri's broad expertise means fewer specialist referrals and more comprehensive care in one place. Whether you need a routine cleaning, an implant, or a complete cosmetic overhaul, our team has you covered. We direct-bill insurance and welcome new patients from Ladner.",
    faqs: [
      {
        question: "Do you accept patients from Ladner?",
        answer:
          "Yes — Ladner residents are welcome. It's approximately 20–25 minutes to Astra Dental Centre via Hwy 17 and Hwy 10.",
      },
      {
        question: "How do I get from Ladner to your clinic?",
        answer:
          "Take Hwy 17 north to Hwy 10 east, then connect to Fraser Hwy east. We're at 20061 Fraser Hwy, Unit 120, Langley.",
      },
      {
        question: "Do you offer dental implants near Ladner?",
        answer:
          "Yes — implant consultations and placement are available at Astra Dental Centre for patients from Ladner and Delta.",
      },
      {
        question: "Can I get Invisalign treatment near Ladner?",
        answer:
          "Absolutely — Dr. Potluri is Invisalign certified. Ladner patients receive full treatment from consultation through completion.",
      },
      {
        question: "Do you take new patients from Ladner?",
        answer:
          "Yes — we're always accepting new patients from Ladner. Book online or call 604-533-8806 to get started.",
      },
    ],
    ctaHeading: "Ladner Patients: Comprehensive Dental Care in Langley",
    ctaSubtext:
      "A short drive from Ladner leads to outstanding dental care at Astra Dental Centre. Book today.",
  },
  {
    slug: "dentist-tsawwassen",
    name: "Tsawwassen",
    footerName: "Tsawwassen, BC",
    regionLabel: "Tsawwassen, BC",
    heroTitle: "Trusted Dentist Serving Tsawwassen Patients",
    heroSubtitle: "Advanced dental care in Langley — worth the drive from Tsawwassen.",
    introHeading: "Tsawwassen Patients Choose Astra Dental Centre",
    introParagraph:
      "Tsawwassen residents seeking advanced dental services find Astra Dental Centre at Unit 120, 20061 Fraser Hwy in Langley to be a top choice. Approximately 25–30 minutes from Tsawwassen via Hwy 17 and Hwy 10 heading east, our clinic offers treatments including CEREC same-day crowns, dental implants, Invisalign, full cosmetic smile design, and comprehensive family dentistry — all in one convenient location with an experienced, welcoming team.",
    driveTime: "approximately 25–30 minutes",
    driveRoute: "north on Hwy 17 to Hwy 10 east to Fraser Hwy",
    directionsDetail:
      "From Tsawwassen, take Hwy 17 north toward the Hwy 10 interchange, then head east on Hwy 10 toward Langley. Connect to Fraser Hwy east. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 25–30 minutes from Tsawwassen.",
    whyChooseParagraph:
      "Tsawwassen patients who visit Astra Dental Centre consistently find the experience well worth the drive. Our clinic's combination of Dr. Potluri's clinical depth, advanced technology, and genuinely caring team creates an environment where patients feel confident and comfortable. We offer CEREC same-day crowns, Invisalign, dental implants, and more — all with direct insurance billing.",
    faqs: [
      {
        question: "Do you accept patients from Tsawwassen?",
        answer:
          "Yes — Tsawwassen patients are welcome. It's about 25–30 minutes to Astra Dental Centre via Hwy 17 north and Hwy 10 east.",
      },
      {
        question: "How do I get from Tsawwassen to your clinic?",
        answer:
          "Take Hwy 17 north to Hwy 10 east, then connect to Fraser Hwy. We're at 20061 Fraser Hwy, Unit 120, Langley.",
      },
      {
        question: "Do you offer CEREC crowns for Tsawwassen patients?",
        answer:
          "Yes — CEREC same-day crowns are available. One visit, no temporaries — ideal for patients travelling from Tsawwassen.",
      },
      {
        question: "Is Invisalign available for Tsawwassen residents?",
        answer:
          "Absolutely. Dr. Potluri is Invisalign certified and provides full treatment for Tsawwassen patients.",
      },
      {
        question: "Do you offer Saturday appointments for Tsawwassen patients?",
        answer:
          "Yes — Saturday hours from 9 AM to 3 PM make the trip from Tsawwassen more convenient.",
      },
    ],
    ctaHeading: "Tsawwassen: Premium Dental Care Awaits in Langley",
    ctaSubtext:
      "Astra Dental Centre is a comfortable drive from Tsawwassen. Book your appointment online or call today.",
  },
  {
    slug: "dentist-pitt-meadows",
    name: "Pitt Meadows",
    footerName: "Pitt Meadows, BC",
    regionLabel: "Pitt Meadows, BC",
    heroTitle: "Trusted Dentist Serving Pitt Meadows Patients",
    heroSubtitle: "Expert dental care in Langley — accessible from Pitt Meadows via Golden Ears Bridge.",
    introHeading: "Pitt Meadows Patients Welcome at Astra Dental Centre",
    introParagraph:
      "Pitt Meadows residents can conveniently reach Astra Dental Centre via the Golden Ears Bridge — typically 20–25 minutes to our clinic at Unit 120, 20061 Fraser Hwy in Langley. We offer comprehensive dental services for the whole family, including preventive hygiene, children's dentistry, Invisalign, CEREC same-day crowns, dental implants, and full cosmetic smile design. If you're looking for a dentist who combines advanced technology with genuine, personalized care, Astra Dental Centre is your destination.",
    driveTime: "approximately 20–25 minutes",
    driveRoute: "south via Golden Ears Bridge to Langley",
    directionsDetail:
      "From Pitt Meadows, cross the Golden Ears Bridge south toward Langley. Follow 208 St south to Dewdney Trunk Rd or connect to Fraser Hwy east. Astra Dental Centre is at 20061 Fraser Hwy (Unit 120), approximately 20–25 minutes from central Pitt Meadows.",
    whyChooseParagraph:
      "Pitt Meadows patients who visit Astra Dental Centre value the convenience of a full-service clinic where everything is available in one place. Dr. Potluri's expertise across general dentistry, orthodontics, implantology, and cosmetic dentistry means you spend less time travelling between specialists and more time enjoying your healthy smile. We direct-bill insurance and always welcome new patients.",
    faqs: [
      {
        question: "Do you accept patients from Pitt Meadows?",
        answer:
          "Yes — Pitt Meadows residents are welcome at Astra Dental Centre. We're approximately 20–25 minutes south via the Golden Ears Bridge.",
      },
      {
        question: "How do I get from Pitt Meadows to your clinic?",
        answer:
          "Cross the Golden Ears Bridge south and follow signs toward Langley / Fraser Hwy. We're at 20061 Fraser Hwy, Unit 120.",
      },
      {
        question: "Do you offer family dentistry for Pitt Meadows residents?",
        answer:
          "Yes — we provide care for patients of all ages from Pitt Meadows, from young children to seniors.",
      },
      {
        question: "Can I book a Saturday appointment from Pitt Meadows?",
        answer:
          "Yes — Saturday appointments from 9 AM to 3 PM make the drive from Pitt Meadows even more practical.",
      },
      {
        question: "Do you accept new patients from Pitt Meadows?",
        answer:
          "Absolutely — we're always accepting new patients. Call 604-533-8806 or book online to schedule your first visit.",
      },
    ],
    ctaHeading: "Pitt Meadows: Outstanding Dental Care is a Bridge Away",
    ctaSubtext:
      "Cross the Golden Ears Bridge and arrive at Astra Dental Centre in Langley. Book your appointment today.",
  },
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find((l) => l.slug === slug);
}
