export interface CategoryIncludes {
  title: string;
  desc: string;
}

export interface WhoForItem {
  label: string;
  desc: string;
}

export interface CategoryPageContent {
  seoTitle: string;
  intro: string;
  details: string;
  heroImage: string;
  includes: CategoryIncludes[];
  whoFor: WhoForItem[];
  beforeAfter?: boolean;
}

export const categoryPageContent: Record<string, CategoryPageContent> = {
  "general-dentistry": {
    seoTitle: "General Dentistry in Langley, BC",
    intro: "General dentistry forms the cornerstone of your long-term oral health. At Astra Dental Centre in Langley, BC, our general dentistry services are designed to keep your teeth and gums healthy at every stage of life — from your child's first checkup to restorative care for seniors.",
    details: "Whether you need a simple tooth-coloured filling, custom-fitted dentures, or a precision inlay restoration, our experienced team uses modern techniques and tooth-coloured materials to deliver results that look and feel natural. We focus on prevention first, so routine visits help us catch problems early — before they become painful or costly.",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Composite Fillings", desc: "Tooth-coloured fillings that blend seamlessly with your natural teeth" },
      { title: "Dentures", desc: "Custom-fitted full or partial dentures to restore your smile and function" },
      { title: "Inlay Restorations", desc: "Precision-crafted restorations that preserve more of your natural tooth" },
      { title: "Onlay Restorations", desc: "Extended restorations for larger areas of damage or decay" },
      { title: "Bite Guards", desc: "Custom night guards to protect teeth from grinding and clenching" },
    ],
    whoFor: [
      { label: "Patients with cavities", desc: "We restore decayed teeth with natural-looking composite fillings" },
      { label: "Adults missing teeth", desc: "Custom dentures that fit comfortably and restore full chewing function" },
      { label: "Teeth grinders", desc: "Custom bite guards to protect enamel and relieve jaw tension overnight" },
      { label: "Patients with damaged teeth", desc: "Inlays and onlays repair and strengthen structurally compromised teeth" },
      { label: "Families in Langley", desc: "Comprehensive care for every member of your household in one clinic" },
    ],
  },
  "cosmetic-dentistry": {
    seoTitle: "Cosmetic Dentistry in Langley, BC",
    intro: "A beautiful smile can transform your confidence, your first impression, and your overall quality of life. Astra Dental Centre offers a comprehensive range of cosmetic dentistry services in Langley, BC, designed to enhance the appearance of your smile using the latest techniques and materials.",
    details: "Whether you're looking to brighten stained teeth, correct chips or gaps, or completely redesign your smile, our cosmetic team will work with you to create a personalized treatment plan. We use only the highest-quality porcelain and ceramic materials for veneers and crowns — and our CEREC technology allows us to complete many restorations in a single visit.",
    heroImage: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Zoom Teeth Whitening", desc: "In-office whitening that brightens teeth by several shades in one visit" },
      { title: "Porcelain Veneers", desc: "Ultra-thin shells that correct shape, colour, and size in one treatment" },
      { title: "CEREC Same-Day Crowns", desc: "Digital crowns designed and placed in a single appointment" },
      { title: "Dental Bridges", desc: "Fixed restorations that fill gaps and restore your smile seamlessly" },
      { title: "Dental Crowns", desc: "Full-coverage restorations that rebuild damaged teeth beautifully" },
    ],
    whoFor: [
      { label: "Patients with stained teeth", desc: "Professional ZOOM whitening delivers dramatic results safely" },
      { label: "Adults with chipped or worn teeth", desc: "Veneers and crowns restore strength and appearance simultaneously" },
      { label: "Patients missing teeth", desc: "Bridges fill gaps naturally so no one can tell the difference" },
      { label: "Brides, professionals, or anyone with a big event", desc: "Look your best for the moments that matter most" },
      { label: "Patients wanting a smile makeover", desc: "We combine treatments for a complete smile transformation" },
    ],
    beforeAfter: true,
  },
  "preventive-dentistry": {
    seoTitle: "Preventive Dentistry in Langley, BC",
    intro: "Prevention is the most effective — and most affordable — approach to dental care. Our preventive dentistry services at Astra Dental Centre in Langley, BC are designed to protect your oral health, catch problems early, and help you avoid more complex and costly treatments down the road.",
    details: "Regular professional cleanings remove tartar and buildup that brushing at home simply can't reach. Combined with comprehensive exams and digital X-rays, each preventive visit gives our team a thorough picture of your oral health so we can identify concerns before they escalate. We believe that an informed, proactive patient is a healthier patient.",
    heroImage: "https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Comprehensive Dental Exams", desc: "Full oral health assessment at every routine visit" },
      { title: "Professional Cleanings", desc: "Removal of tartar, plaque, and surface staining for a healthier smile" },
      { title: "Digital X-Rays", desc: "Low-radiation imaging to detect hidden decay and bone changes" },
      { title: "Fluoride Treatments", desc: "Strengthens enamel and reduces cavity risk, especially for children" },
      { title: "Oral Cancer Screening", desc: "Routine screening for early detection of oral abnormalities" },
    ],
    whoFor: [
      { label: "All patients every 6 months", desc: "Routine cleanings and exams are the foundation of good oral health" },
      { label: "Children and teens", desc: "Early preventive care sets the foundation for a lifetime of healthy teeth" },
      { label: "Patients with gum disease history", desc: "More frequent cleanings keep gum disease from recurring" },
      { label: "High-cavity-risk patients", desc: "Fluoride treatments and dietary guidance reduce your risk significantly" },
      { label: "Busy adults", desc: "Short, simple visits prevent the need for lengthy future treatments" },
    ],
  },
  "orthodontics": {
    seoTitle: "Orthodontics in Langley, BC",
    intro: "Properly aligned teeth are about more than aesthetics — they affect how you bite, chew, speak, and maintain your oral health. Astra Dental Centre offers comprehensive orthodontic treatments in Langley, BC for children, teens, and adults who want a straighter, healthier smile.",
    details: "From clear Invisalign aligners for adults and teens who want a discreet option, to traditional braces for children with developing smiles, we offer personalized orthodontic treatment plans for every case. We also provide TMJ therapy for patients experiencing jaw pain or bite dysfunction — a commonly overlooked but highly treatable condition.",
    heroImage: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Invisalign Clear Aligners", desc: "Virtually invisible aligners for discreet straightening in Langley" },
      { title: "Braces for Kids", desc: "Early orthodontic treatment to guide jaw and tooth development" },
      { title: "Braces for Adults", desc: "Ceramic and metal options designed to fit adult lifestyles" },
      { title: "TMJ Treatment", desc: "Diagnosis and relief for jaw pain, clicking, and bite dysfunction" },
    ],
    whoFor: [
      { label: "Children aged 7+", desc: "Early evaluation allows us to catch and correct alignment issues early" },
      { label: "Teens wanting discreet treatment", desc: "Invisalign Teen or clear brackets that don't stand out" },
      { label: "Adults with crooked or crowded teeth", desc: "It's never too late to achieve a straighter, healthier smile" },
      { label: "Patients with jaw pain", desc: "TMJ therapy relieves pain and restores comfortable jaw movement" },
      { label: "Patients with bite issues", desc: "We correct overbites, underbites, crossbites, and spacing problems" },
    ],
  },
  "endodontics": {
    seoTitle: "Endodontics in Langley, BC",
    intro: "When a tooth becomes severely infected or damaged, endodontic treatment can save it — eliminating pain and preserving your natural smile. At Astra Dental Centre in Langley, BC, our endodontic services focus on relieving discomfort and restoring the health of affected teeth with precision and care.",
    details: "Modern endodontic treatment — including root canal therapy — is far more comfortable than most patients expect. With advanced anesthetics and gentle techniques, most procedures are no more uncomfortable than getting a regular filling. Our goal is always to save your natural tooth wherever possible, which leads to better long-term outcomes than extraction and replacement.",
    heroImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Root Canal Treatment", desc: "Removes infection and saves severely damaged or decayed teeth" },
      { title: "Cracked Teeth Treatment", desc: "Specialized care to repair and preserve fractured teeth" },
      { title: "Root Amputation", desc: "Targeted removal of a damaged root to save the remaining tooth structure" },
      { title: "Endodontic Surgery", desc: "Apicoectomy and other procedures for complex or recurring infections" },
    ],
    whoFor: [
      { label: "Patients with tooth pain", desc: "Persistent or severe toothache often indicates infection requiring treatment" },
      { label: "Patients with cracked teeth", desc: "Cracks can lead to infection and pain if not treated promptly" },
      { label: "Patients with dental abscesses", desc: "We eliminate infection and restore the tooth to full function" },
      { label: "Patients facing extraction", desc: "Endodontic treatment often offers a way to save the natural tooth" },
      { label: "Patients with deep decay", desc: "When decay reaches the pulp, root canal therapy provides lasting relief" },
    ],
  },
  "oral-surgery": {
    seoTitle: "Oral Surgery in Langley, BC",
    intro: "Some dental conditions require a surgical approach to fully resolve. Astra Dental Centre provides a comprehensive range of oral surgery services in Langley, BC, performed with precision, modern technique, and genuine care for your comfort and recovery.",
    details: "From wisdom tooth extractions and bone grafting to dental implants and impacted canines, our team is experienced with the full range of oral surgical procedures. We use local anesthesia and patient-centered protocols to ensure each procedure is as comfortable as possible, with clear post-operative instructions to support your healing.",
    heroImage: "https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Wisdom Teeth Extractions", desc: "Safe, comfortable removal of problematic wisdom teeth" },
      { title: "Dental Implants", desc: "Permanent, natural-feeling tooth replacements anchored in the jawbone" },
      { title: "Bone Grafting", desc: "Rebuilds jaw density to support implants or address bone loss" },
      { title: "Impacted Canines", desc: "Surgical exposure and orthodontic guidance for teeth that didn't erupt" },
    ],
    whoFor: [
      { label: "Patients with wisdom teeth pain", desc: "Timely extraction prevents crowding, infection, and damage to nearby teeth" },
      { label: "Patients missing one or more teeth", desc: "Dental implants offer the most natural and permanent replacement option" },
      { label: "Implant candidates with bone loss", desc: "Bone grafting restores the jawbone needed for successful implant placement" },
      { label: "Teens with impacted canines", desc: "Early surgical intervention guides the tooth into its correct position" },
      { label: "Patients with recurring infections", desc: "Surgical solutions eliminate the source of persistent dental infections" },
    ],
    beforeAfter: true,
  },
  "gum-surgery": {
    seoTitle: "Gum Surgery in Langley, BC",
    intro: "Healthy gums are the foundation of every healthy smile. When gum disease advances beyond what non-surgical cleaning can address, our gum surgery services at Astra Dental Centre in Langley, BC provide targeted, effective treatment to stop disease progression and restore gum health.",
    details: "Our gum surgery procedures are designed to remove infection, reduce periodontal pockets, and restore a healthy gum line. Whether you need pocket reduction surgery, gum grafting to address recession, or regenerative procedures, our team takes a conservative, results-focused approach with full aftercare support.",
    heroImage: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Periodontal Pocket Reduction", desc: "Removes bacteria from deep pockets to stop gum disease progression" },
      { title: "Gum Grafting", desc: "Restores receding gum tissue and protects exposed tooth roots" },
      { title: "Gum Recession Treatment", desc: "Conservative and surgical approaches to address recession at any stage" },
      { title: "Regenerative Procedures", desc: "Advanced techniques to rebuild lost bone and gum tissue" },
    ],
    whoFor: [
      { label: "Patients with advanced gum disease", desc: "Surgical treatment stops infection and protects teeth from further damage" },
      { label: "Patients with receding gums", desc: "Gum grafts cover exposed roots and reduce sensitivity" },
      { label: "Patients with deep periodontal pockets", desc: "Pocket reduction removes the bacterial environment causing disease" },
      { label: "Patients with loose teeth from bone loss", desc: "Regenerative procedures rebuild the support structure around teeth" },
      { label: "Patients who've had scaling and root planing", desc: "Surgical follow-up ensures complete treatment of severe cases" },
    ],
  },
  "prosthodontics": {
    seoTitle: "Prosthodontics in Langley, BC",
    intro: "Prosthodontics is the specialized area of dentistry focused on restoring and replacing teeth. Whether you need a single crown, a dental bridge, or a complete set of dentures, Astra Dental Centre in Langley, BC provides high-quality prosthodontic care to restore both function and aesthetics.",
    details: "Our prosthodontic services are built around precision, durability, and natural appearance. We use the finest ceramic and composite materials, combined with careful craftsmanship, to ensure each restoration blends seamlessly with your natural teeth. The goal is always the same: to give you a smile that functions fully and looks completely natural.",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Dental Crowns", desc: "Custom-made caps that protect and restore damaged or weakened teeth" },
      { title: "Dental Bridges", desc: "Fixed restorations that replace missing teeth using neighbouring teeth for support" },
      { title: "Full Dentures", desc: "Complete upper or lower arch replacements for fully edentulous patients" },
      { title: "Partial Dentures", desc: "Removable restorations for patients missing several teeth" },
      { title: "Implant-Supported Restorations", desc: "Crowns, bridges, or dentures anchored to dental implants for maximum stability" },
    ],
    whoFor: [
      { label: "Patients with severely damaged teeth", desc: "Crowns restore strength and appearance to cracked or heavily filled teeth" },
      { label: "Patients missing one or more teeth", desc: "Bridges and implant restorations fill gaps and restore full function" },
      { label: "Patients needing full-mouth restoration", desc: "We rebuild smiles from the ground up with comprehensive prosthodontic care" },
      { label: "Denture wearers seeking improvement", desc: "Implant-supported dentures offer stability that traditional dentures cannot match" },
      { label: "Patients after tooth loss from injury or decay", desc: "Prosthodontic restoration returns your smile to health and confidence" },
    ],
    beforeAfter: true,
  },
  "periodontics": {
    seoTitle: "Periodontics in Langley, BC",
    intro: "Periodontal health — the health of your gums and the bone supporting your teeth — is critical to your overall oral and systemic well-being. At Astra Dental Centre in Langley, BC, our periodontic services target gum disease at every stage, from early gingivitis to advanced periodontitis.",
    details: "Research continues to reveal connections between gum disease and conditions like heart disease, diabetes, and respiratory issues. Our approach to periodontal care prioritizes early detection, thorough treatment, and ongoing maintenance — because healthy gums are not just about your smile, they are part of your whole-body health.",
    heroImage: "https://images.pexels.com/photos/6627418/pexels-photo-6627418.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "Periodontal Evaluation", desc: "Comprehensive assessment of gum pocket depths, bone levels, and gum health" },
      { title: "Scaling and Root Planing", desc: "Deep cleaning below the gum line to remove tartar and smooth root surfaces" },
      { title: "Periodontal Maintenance", desc: "Ongoing monitoring appointments to keep gum disease from returning" },
      { title: "Advanced Periodontal Treatment", desc: "Surgical options for cases that require more than non-surgical therapy" },
    ],
    whoFor: [
      { label: "Patients with bleeding or swollen gums", desc: "Early intervention prevents mild gingivitis from progressing to periodontitis" },
      { label: "Patients with receding gums or loose teeth", desc: "Advanced periodontal care addresses the root cause of bone and gum loss" },
      { label: "Smokers and diabetic patients", desc: "Higher-risk patients benefit from more frequent monitoring and preventive care" },
      { label: "Patients with a family history of gum disease", desc: "Genetic risk makes regular periodontal screening especially important" },
      { label: "Patients completing active gum treatment", desc: "Periodontal maintenance keeps results stable long-term" },
    ],
  },
  "childrens-dentistry": {
    seoTitle: "Children's Dentistry in Langley, BC",
    intro: "Giving your child a positive dental experience early sets the foundation for a lifetime of healthy teeth and a confident smile. At Astra Dental Centre in Langley, BC, our children's dentistry services are designed to be gentle, engaging, and educational — so your little one actually looks forward to their dental visits.",
    details: "From a baby's first tooth to teenage checkups, we provide all the preventive and restorative care your child needs in a friendly, welcoming environment. We take extra time to explain what we're doing in age-appropriate ways, and we encourage children to ask questions. Our goal is not just healthy teeth — it's a child who grows up comfortable and unafraid of dental care.",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=1200",
    includes: [
      { title: "First Dental Visits", desc: "Gentle, fun introductions to the dental environment for infants and toddlers" },
      { title: "Routine Exams and Cleanings", desc: "Regular checkups to monitor growth and keep young teeth clean and healthy" },
      { title: "Fluoride Treatments", desc: "Strengthens enamel and significantly reduces cavity risk in children" },
      { title: "Dental Sealants", desc: "Protective coatings on back teeth to block cavities in hard-to-clean grooves" },
      { title: "Tooth-Coloured Fillings", desc: "Natural-looking restorations when cavities do occur" },
      { title: "Orthodontic Monitoring", desc: "Early monitoring to identify alignment issues and time treatment appropriately" },
    ],
    whoFor: [
      { label: "Infants (first tooth or first birthday)", desc: "Early visits establish comfort and allow us to catch developmental issues" },
      { label: "Toddlers and preschoolers", desc: "We make the dental visit fun and stress-free from the very beginning" },
      { label: "School-aged children", desc: "Regular cleanings, cavity prevention, and healthy habit guidance" },
      { label: "Teens", desc: "Orthodontic monitoring, wisdom tooth assessment, and cosmetic options" },
      { label: "Children with dental anxiety", desc: "Our calm, patient team moves at your child's pace — never rushing or pressuring" },
    ],
  },
};
