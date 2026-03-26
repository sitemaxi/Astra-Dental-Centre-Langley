export interface ServiceDetailExtra {
  seoTitle: string;
  heroImage: string;
  whoFor: Array<{ label: string; desc: string }>;
  beforeAfter?: Array<{ label: string; before: string; after: string }>;
}

export const serviceDetailExtras: Record<string, ServiceDetailExtra> = {
  "composite-fillings": {
    seoTitle: "Composite Fillings in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with cavities", desc: "Composite resin restores decayed teeth naturally without metallic appearance" },
      { label: "Patients with chipped teeth", desc: "Minor chips and fractures can be repaired quickly in a single visit" },
      { label: "Patients replacing old amalgam fillings", desc: "Switch from silver fillings to tooth-coloured composite for a more natural look" },
      { label: "Children and teens", desc: "Mercury-free, natural-looking restorations that are safe for all ages" },
      { label: "Patients in Langley wanting discreet treatment", desc: "No one will know you have a filling — the colour matches your natural tooth" },
    ],
  },
  "dentures": {
    seoTitle: "Dentures in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients missing multiple or all teeth", desc: "Dentures restore appearance and chewing function effectively" },
      { label: "Patients who struggle to chew or speak clearly", desc: "A properly fitted denture resolves these issues comfortably" },
      { label: "Patients whose existing dentures are uncomfortable", desc: "We provide relines, adjustments, and new dentures as needed" },
      { label: "Patients seeking implant-supported stability", desc: "Implant dentures eliminate slipping and offer enhanced confidence" },
      { label: "Seniors in Langley", desc: "We specialize in gentle, comfortable denture care for older patients" },
    ],
  },
  "inlay-restorations": {
    seoTitle: "Inlay Restorations in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with moderate tooth decay", desc: "Inlays restore the tooth with a stronger, more durable option than a filling" },
      { label: "Patients with failed or cracked old fillings", desc: "An inlay provides a precise, long-lasting replacement" },
      { label: "Patients who prefer minimal tooth reduction", desc: "Inlays preserve more healthy tooth structure than a crown" },
      { label: "Patients who want natural-looking results", desc: "Porcelain inlays are virtually indistinguishable from natural enamel" },
    ],
  },
  "onlay-restorations": {
    seoTitle: "Onlay Restorations in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with large or failing fillings", desc: "An onlay provides stronger, longer-lasting protection for compromised teeth" },
      { label: "Patients with weakened tooth cusps", desc: "Onlays reinforce cusps to prevent fracture under bite pressure" },
      { label: "Patients seeking an alternative to a crown", desc: "Onlays restore teeth conservatively when a full crown isn't necessary" },
      { label: "Patients who want tooth-coloured restorations", desc: "Porcelain onlays blend seamlessly with your natural smile" },
    ],
  },
  "bite-guards": {
    seoTitle: "Bite Guards in Langley, BC",
    heroImage: "https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients who grind their teeth at night", desc: "A custom bite guard protects enamel and prevents premature wear" },
      { label: "Patients with jaw pain or morning headaches", desc: "Bite guards relieve tension and reduce TMJ-related discomfort" },
      { label: "Patients with chipped or sensitive teeth", desc: "Guards protect against the force of clenching that causes damage" },
      { label: "Patients with TMJ symptoms", desc: "Bite guard therapy is often a first-line treatment for jaw dysfunction" },
      { label: "Patients dissatisfied with over-the-counter options", desc: "A custom-fitted guard is far more comfortable and effective" },
    ],
  },
  "bridges": {
    seoTitle: "Dental Bridges in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients missing one or more adjacent teeth", desc: "A bridge fills the gap with a natural-looking, fixed restoration" },
      { label: "Patients who want a non-removable solution", desc: "Bridges are permanently bonded — no taking out at night" },
      { label: "Patients with healthy neighbouring teeth", desc: "Existing teeth provide the support needed for the bridge" },
      { label: "Patients concerned about shifting teeth", desc: "A bridge prevents surrounding teeth from drifting into empty spaces" },
    ],
    beforeAfter: [
      {
        label: "Missing tooth replaced with bridge",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "crowns": {
    seoTitle: "Dental Crowns in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with cracked or fractured teeth", desc: "A crown encases the tooth entirely, preventing further breakage" },
      { label: "Patients after root canal treatment", desc: "A crown protects the treated tooth and restores full function" },
      { label: "Patients with heavily worn or damaged teeth", desc: "Crowns rebuild teeth that are too compromised for a filling" },
      { label: "Patients with dental implants", desc: "A crown completes the implant restoration for a natural-looking result" },
      { label: "Patients wanting improved appearance", desc: "Crowns can reshape and brighten discoloured or misshapen teeth" },
    ],
    beforeAfter: [
      {
        label: "Damaged tooth restored with crown",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "zoom-teeth-whitening": {
    seoTitle: "Zoom Teeth Whitening in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with stained or yellowed teeth", desc: "ZOOM effectively removes staining from coffee, tea, wine, and aging" },
      { label: "Patients with an upcoming event", desc: "Achieve noticeably whiter teeth in a single appointment" },
      { label: "Patients who've tried over-the-counter whitening", desc: "Professional treatment delivers far more powerful and even results" },
      { label: "Adults and teens in Langley", desc: "Safe and supervised whitening for a confident, brighter smile" },
    ],
    beforeAfter: [
      {
        label: "Teeth whitening results",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "porcelain-veneers": {
    seoTitle: "Porcelain Veneers in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with discoloured or stained teeth", desc: "Veneers create a uniformly bright, natural-looking smile" },
      { label: "Patients with chipped, cracked, or worn teeth", desc: "Veneers restore the appearance and protect against further damage" },
      { label: "Patients with minor spacing or alignment concerns", desc: "Veneers can correct mild issues without orthodontic treatment" },
      { label: "Patients seeking a complete smile makeover", desc: "Full sets of veneers create a dramatically improved smile" },
    ],
    beforeAfter: [
      {
        label: "Smile transformation with veneers",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "cerec-dentistry": {
    seoTitle: "CEREC Same-Day Dentistry in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Busy patients who need a crown or restoration", desc: "CEREC eliminates the need for a second appointment entirely" },
      { label: "Patients who dislike traditional impressions", desc: "Digital scanning replaces messy putty impressions" },
      { label: "Patients wanting metal-free, ceramic restorations", desc: "CEREC produces beautiful, natural-looking ceramic crowns and inlays" },
      { label: "Patients requiring emergency dental restoration", desc: "Same-day treatment means no waiting in discomfort with a temporary" },
    ],
  },
  "dental-exams-and-cleanings": {
    seoTitle: "Dental Exams & Cleanings in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "All patients every 6 months", desc: "Routine care is the single most effective way to prevent dental problems" },
      { label: "Children and teens", desc: "Early preventive visits build lasting oral health habits" },
      { label: "Patients with gum disease history", desc: "More frequent cleanings keep periodontitis from returning" },
      { label: "Patients with crowns, implants, or bridges", desc: "Professional care maintains existing restorations longer" },
      { label: "Patients who haven't visited the dentist recently", desc: "We provide non-judgmental, thorough care to get you back on track" },
    ],
  },
  "dental-x-rays": {
    seoTitle: "Dental X-Rays in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "All patients during routine exams", desc: "Digital X-rays help detect issues invisible to the naked eye" },
      { label: "Children with developing teeth", desc: "X-rays monitor eruption, spacing, and jaw development" },
      { label: "Patients with symptoms of decay or pain", desc: "X-rays pinpoint the exact location and extent of the problem" },
      { label: "Patients before implants or surgery", desc: "Bone density and anatomy assessment is essential for treatment planning" },
    ],
  },
  "tmj": {
    seoTitle: "TMJ Treatment in Langley, BC",
    heroImage: "https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with jaw pain or clicking", desc: "TMJ therapy targets the joint dysfunction causing your symptoms" },
      { label: "Patients with frequent morning headaches", desc: "Nighttime clenching is a common cause that bite guard therapy can resolve" },
      { label: "Patients with limited jaw opening", desc: "We assess and treat restricted jaw movement with conservative approaches" },
      { label: "Patients with bite misalignment", desc: "Bite adjustment or orthodontic treatment may reduce jaw strain" },
    ],
  },
  "invisalign": {
    seoTitle: "Invisalign in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Adults wanting discreet orthodontic treatment", desc: "Nearly invisible aligners that no one will notice at work or social events" },
      { label: "Teens who want to avoid metal brackets", desc: "Invisalign Teen offers all the benefits with a more comfortable experience" },
      { label: "Patients with mild to moderate alignment issues", desc: "Crowding, spacing, overbite, and underbite are all treatable" },
      { label: "Patients who want removable treatment", desc: "Remove aligners for eating, brushing, and special occasions" },
    ],
  },
  "braces-for-kids": {
    seoTitle: "Braces for Kids in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Children aged 7–12 with alignment concerns", desc: "Early evaluation allows us to intercept issues before they worsen" },
      { label: "Children with crowded or crooked teeth", desc: "Braces guide teeth into proper alignment during active growth" },
      { label: "Children with overbites, underbites, or crossbites", desc: "Early correction improves jaw function and facial balance" },
      { label: "Children with missing or extra teeth", desc: "Orthodontic planning ensures space is managed appropriately" },
    ],
  },
  "braces-for-adults": {
    seoTitle: "Braces for Adults in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Adults with crooked or crowded teeth", desc: "Braces achieve lasting alignment improvement at any age" },
      { label: "Adults with shifting teeth after previous treatment", desc: "Retention issues are common — we can get your smile back on track" },
      { label: "Adults wanting more affordable braces options", desc: "Traditional metal brackets remain highly effective and budget-friendly" },
      { label: "Adults with bite problems affecting jaw health", desc: "Correct alignment reduces jaw strain and long-term wear" },
    ],
  },
  "cracked-teeth-treatment": {
    seoTitle: "Cracked Teeth Treatment in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with pain when biting or chewing", desc: "Pain when releasing bite pressure is a classic sign of a cracked tooth" },
      { label: "Patients with temperature sensitivity", desc: "Cracks allow temperature to reach the nerve, causing sharp pain" },
      { label: "Patients with known tooth fractures", desc: "Early treatment prevents the crack from progressing to the root" },
      { label: "Patients who grind their teeth", desc: "Habitual grinding creates cracks — treatment and prevention go together" },
    ],
  },
  "root-amputation": {
    seoTitle: "Root Amputation in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with infection isolated to one root", desc: "Removing only the affected root saves the rest of the tooth" },
      { label: "Patients with advanced bone loss around one root", desc: "Root amputation removes the compromised root while preserving function" },
      { label: "Patients seeking alternatives to full extraction", desc: "Root amputation allows us to save what remains of the natural tooth" },
    ],
  },
  "root-canal-treatment": {
    seoTitle: "Root Canal Treatment in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with a dental abscess", desc: "Root canal treatment removes the infection and relieves acute pain" },
      { label: "Patients with severe or persistent toothache", desc: "Deep infection or inflammation requires treatment to save the tooth" },
      { label: "Patients with deep decay reaching the pulp", desc: "When decay reaches the nerve, root canal therapy is the tooth-saving option" },
      { label: "Patients with a cracked tooth affecting the pulp", desc: "We treat the internal damage and restore the tooth with a crown" },
    ],
  },
  "endodontic-surgery": {
    seoTitle: "Endodontic Surgery in Langley, BC",
    heroImage: "https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with persistent infection after root canal", desc: "Surgical intervention eliminates infection that non-surgical treatment cannot reach" },
      { label: "Patients with a root tip abscess", desc: "Apicoectomy removes the infected root end and seals the canal" },
      { label: "Patients with blocked or calcified canals", desc: "Surgery provides access when the canal cannot be reached conventionally" },
    ],
  },
  "wisdom-teeth-extractions": {
    seoTitle: "Wisdom Teeth Extractions in Langley, BC",
    heroImage: "https://images.pexels.com/photos/4269694/pexels-photo-4269694.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Teens and adults with impacted wisdom teeth", desc: "Impacted wisdom teeth can cause pain, infection, and crowding" },
      { label: "Patients with recurring gum pain in the back of the mouth", desc: "Partially erupted wisdom teeth trap bacteria and cause repeated infections" },
      { label: "Patients before orthodontic treatment", desc: "Removing wisdom teeth can prevent future crowding of straightened teeth" },
      { label: "Patients with wisdom teeth causing pressure or pain", desc: "Early removal is typically simpler with faster recovery" },
    ],
  },
  "bone-grafting": {
    seoTitle: "Bone Grafting in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients planning dental implant placement", desc: "Adequate bone volume is required for a successful implant" },
      { label: "Patients with bone loss from gum disease", desc: "Grafting rebuilds lost bone and creates a stable foundation" },
      { label: "Patients after tooth extraction", desc: "Socket preservation prevents bone loss immediately after removal" },
      { label: "Patients with sunken facial appearance from bone loss", desc: "Rebuilding jawbone structure supports facial volume and balance" },
    ],
  },
  "dental-implants": {
    seoTitle: "Dental Implants in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with one or more missing teeth", desc: "Implants are the most permanent and natural-feeling tooth replacement" },
      { label: "Patients unhappy with removable dentures", desc: "Implant-supported restorations don't slip, shift, or require adhesive" },
      { label: "Patients with healthy gums and adequate bone", desc: "Good bone density and healthy gum tissue are key success factors" },
      { label: "Non-smokers or patients committed to quitting", desc: "Implant success rates are higher in non-smokers" },
    ],
    beforeAfter: [
      {
        label: "Missing tooth replaced with implant",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "impacted-canines": {
    seoTitle: "Impacted Canines Treatment in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Children and teens missing an upper canine", desc: "If the canine hasn't erupted by the expected age, early assessment is key" },
      { label: "Orthodontic patients with blocked teeth", desc: "Surgical exposure combined with orthodontic traction brings the tooth into position" },
      { label: "Patients with crowding preventing eruption", desc: "Space creation and surgical exposure together resolve the impaction" },
    ],
  },
  "gum-surgery": {
    seoTitle: "Gum Surgery in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with advanced gum disease", desc: "Surgical treatment removes infection and stops disease progression" },
      { label: "Patients with deep pockets that don't respond to cleaning", desc: "Pocket reduction surgery provides access to clean below the gum line" },
      { label: "Patients with receding gums and exposed roots", desc: "Gum grafting covers roots and reduces sensitivity" },
      { label: "Patients who have completed scaling and root planing", desc: "Surgery may follow non-surgical treatment in more advanced cases" },
    ],
  },
  "prosthodontics": {
    seoTitle: "Prosthodontics in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with multiple missing or damaged teeth", desc: "Prosthodontic care restores full mouth function and aesthetics" },
      { label: "Patients who need crowns, bridges, or dentures", desc: "All prosthodontic restorations are available at Astra Dental Centre" },
      { label: "Patients wanting implant-supported restorations", desc: "Implant crowns and overdentures provide the most stable results" },
      { label: "Patients after full-mouth rehabilitation", desc: "Complex cases benefit from comprehensive prosthodontic planning" },
    ],
    beforeAfter: [
      {
        label: "Full mouth restoration",
        before: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600",
        after: "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
  },
  "periodontics": {
    seoTitle: "Periodontics in Langley, BC",
    heroImage: "https://images.pexels.com/photos/6627418/pexels-photo-6627418.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Patients with bleeding or swollen gums", desc: "Early intervention stops mild gingivitis before it becomes periodontitis" },
      { label: "Patients with loose teeth or bone loss", desc: "Advanced periodontal care addresses both the symptoms and the cause" },
      { label: "Smokers and diabetic patients", desc: "Higher-risk patients need more frequent monitoring and customized care" },
      { label: "Patients who completed scaling and root planing", desc: "Periodontal maintenance keeps your results stable long-term" },
    ],
  },
  "childrens-dentistry": {
    seoTitle: "Children's Dentistry in Langley, BC",
    heroImage: "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=800",
    whoFor: [
      { label: "Infants and toddlers", desc: "We recommend a first visit by their first birthday for early monitoring" },
      { label: "School-aged children", desc: "Regular cleanings, sealants, and fluoride keep young teeth healthy" },
      { label: "Teens", desc: "Orthodontic monitoring, wisdom tooth checks, and cavity prevention" },
      { label: "Children with dental anxiety", desc: "Our patient, friendly team helps anxious children feel comfortable" },
      { label: "Children with cavities or developmental concerns", desc: "We treat with gentle techniques and tooth-coloured materials" },
    ],
  },
};
