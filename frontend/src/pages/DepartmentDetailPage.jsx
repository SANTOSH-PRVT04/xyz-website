import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartPulse, Brain, Activity, Baby, Microscope, Pill, Sparkles, Ambulance, ArrowRight, ArrowLeft, Clock, Users, Award, MapPin, Calendar, Stethoscope, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const departmentData = {
  cardiology: {
    name: "Cardiology",
    fullName: "Department of Interventional Cardiology",
    icon: HeartPulse,
    color: "from-red-500 to-rose-600",
    lightBg: "bg-red-50 border-red-100 text-red-600",
    description: "The Cardiology Department at XYZ Hospital is a center of excellence for heart and cardiovascular care. Our team of expert cardiologists provides comprehensive diagnosis, treatment, and management of heart diseases using the most advanced technologies available.",
    facilities: ["Cardiac Catheterization Lab (Cath Lab)", "Advanced Echocardiography Suite", "24/7 Chest Pain Unit", "Cardiac Rehabilitation Center", "Non-Invasive Cardiology Unit", "Electrophysiology Lab"],
    treatments: ["Coronary Angioplasty & Stenting", "Pacemaker Implantation", "Coronary Bypass Surgery (CABG)", "Heart Valve Repair/Replacement", "Cardiac Ablation for Arrhythmias", "Heart Failure Management", "Pediatric Cardiology Interventions", "Preventive Cardiology Screening"],
    stats: { doctors: 8, beds: 45, surgeries: "5,000+", experience: "15+ years avg" },
    doctors: ["Dr. Sarah Jenkins"],
    hod: "Dr. Sarah Jenkins",
    location: "Block C, Floor 1 — Room C-101 to C-115",
    timing: "OPD: Mon–Sat, 9 AM – 6 PM | Emergency: 24/7",
  },
  neurology: {
    name: "Neurology",
    fullName: "Department of Neurosciences",
    icon: Brain,
    color: "from-purple-600 to-indigo-600",
    lightBg: "bg-purple-50 border-purple-100 text-purple-600",
    description: "Our Neurology Department is equipped with cutting-edge diagnostic and therapeutic technology for treating the full spectrum of neurological conditions — from migraines to complex brain tumors.",
    facilities: ["Neuro ICU with 20 beds", "Stereotactic & Functional Neurosurgery Suite", "EEG & EMG Lab", "Advanced MRI & CT Suite", "Stroke Response Unit", "Neuro-Rehabilitation Center"],
    treatments: ["Brain Tumor Surgery", "Endovascular Stroke Treatment", "Epilepsy Surgery", "Deep Brain Stimulation", "Spinal Cord Surgery", "Nerve Conduction Studies", "Parkinson's Disease Management", "Dementia & Alzheimer's Care"],
    stats: { doctors: 6, beds: 30, surgeries: "3,000+", experience: "12+ years avg" },
    doctors: ["Dr. Michael Chen"],
    hod: "Dr. Michael Chen",
    location: "Block N, Floor 2 — Room N-201 to N-220",
    timing: "OPD: Mon–Sat, 9 AM – 5 PM | Stroke Unit: 24/7",
  },
  orthopedics: {
    name: "Orthopedics",
    fullName: "Department of Orthopedics & Joint Replacement",
    icon: Activity,
    color: "from-blue-600 to-cyan-600",
    lightBg: "bg-blue-50 border-blue-100 text-blue-600",
    description: "The Orthopedics department specializes in the treatment of musculoskeletal conditions including fractures, joint disorders, spine problems, and sports injuries using the latest surgical and non-surgical techniques.",
    facilities: ["Robotic Joint Replacement Suite", "Arthroscopy Unit", "Spine Surgery Center", "Sports Medicine Clinic", "Physiotherapy & Rehabilitation", "Bone Density Testing Lab"],
    treatments: ["Total Knee Replacement (Robotic)", "Total Hip Replacement", "Arthroscopic Knee/Shoulder Surgery", "Spinal Fusion & Disc Replacement", "Fracture Fixation", "Ligament Reconstruction (ACL/PCL)", "Pediatric Orthopedic Corrections", "Sports Injury Treatment"],
    stats: { doctors: 7, beds: 40, surgeries: "4,500+", experience: "14+ years avg" },
    doctors: ["Dr. James Wilson"],
    hod: "Dr. James Wilson",
    location: "Block O, Floor 3 — Room O-301 to O-320",
    timing: "OPD: Mon–Sat, 9 AM – 6 PM | Trauma: 24/7",
  },
  pediatrics: {
    name: "Pediatrics",
    fullName: "Department of Pediatrics & Neonatology",
    icon: Baby,
    color: "from-pink-500 to-rose-500",
    lightBg: "bg-pink-50 border-pink-100 text-pink-600",
    description: "Our Pediatrics Department provides comprehensive, compassionate care for infants, children, and adolescents. From routine checkups to complex surgeries, we ensure the best outcomes for young patients.",
    facilities: ["Level 3 NICU (30 beds)", "Pediatric ICU", "Child-Friendly OPD", "Vaccination Center", "Pediatric Surgical Suite", "Adolescent Health Clinic"],
    treatments: ["Neonatal Intensive Care", "Pediatric Surgery", "Childhood Asthma Management", "Growth & Development Assessment", "Pediatric Cardiology", "Genetic Disorder Screening", "Childhood Immunization Programs", "Adolescent Mental Health"],
    stats: { doctors: 10, beds: 50, surgeries: "2,000+", experience: "10+ years avg" },
    doctors: ["Dr. Emily Roberts"],
    hod: "Dr. Emily Roberts",
    location: "Block P, Floor 1 — Room P-101 to P-125",
    timing: "OPD: Mon–Sat, 9 AM – 7 PM | NICU: 24/7",
  },
  oncology: {
    name: "Oncology",
    fullName: "Department of Surgical Oncology & Cancer Care",
    icon: Microscope,
    color: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50 border-amber-100 text-amber-600",
    description: "Our Oncology Center provides world-class cancer diagnosis, treatment, and supportive care. A multidisciplinary team of oncologists works together to provide personalized treatment plans for each patient.",
    facilities: ["Linear Accelerator (Radiation)", "Chemotherapy Day Care", "PET-CT Scanner", "Tumor Board Conference Room", "Palliative Care Unit", "Cancer Screening Center"],
    treatments: ["Surgical Oncology", "Chemotherapy", "Radiation Therapy (IMRT/IGRT)", "Immunotherapy", "Targeted Therapy", "Bone Marrow Transplant", "Robotic Cancer Surgery", "Palliative & Supportive Care"],
    stats: { doctors: 5, beds: 35, surgeries: "3,500+", experience: "16+ years avg" },
    doctors: ["Dr. Marcus Thorne"],
    hod: "Dr. Marcus Thorne",
    location: "Block ON, Floor 2 — Room ON-201 to ON-218",
    timing: "OPD: Mon–Sat, 9 AM – 5 PM | Chemo Unit: Mon–Sat",
  },
  medicine: {
    name: "General Medicine",
    fullName: "Department of Internal Medicine",
    icon: Pill,
    color: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
    description: "The General Medicine department provides expert primary care, preventive health screenings, and management of chronic conditions. Our physicians take a holistic approach to patient wellness.",
    facilities: ["General OPD Clinic", "Health Check-up Suite", "Diabetes Management Center", "Hypertension Clinic", "Infectious Disease Unit", "Day Care Center"],
    treatments: ["Comprehensive Health Check-ups", "Diabetes Management", "Hypertension Control", "Thyroid Disorders", "Infectious Disease Treatment", "Fever & Viral Illness Care", "Lifestyle Disease Counseling", "Pre-operative Medical Clearance"],
    stats: { doctors: 12, beds: 60, surgeries: "N/A", experience: "8+ years avg" },
    doctors: ["Dr. Sophia Lauren"],
    hod: "Dr. Sophia Lauren",
    location: "Block G, Floor 1 — Room G-101 to G-120",
    timing: "OPD: Mon–Sat, 8 AM – 8 PM",
  },
  dermatology: {
    name: "Dermatology",
    fullName: "Department of Dermatology & Cosmetology",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50 border-violet-100 text-violet-600",
    description: "Our Dermatology department offers advanced treatment for all skin, hair, and nail conditions along with state-of-the-art cosmetic procedures to help patients look and feel their best.",
    facilities: ["Laser Treatment Suite", "Cosmetic Procedure Room", "Patch Testing Lab", "Dermatoscopy Unit", "Phototherapy Chamber", "Skin Biopsy Lab"],
    treatments: ["Acne & Scar Treatment", "Laser Hair Removal", "Chemical Peels", "Botox & Dermal Fillers", "Psoriasis & Eczema Management", "Vitiligo Treatment", "Skin Cancer Screening", "Hair Loss Treatment (PRP)"],
    stats: { doctors: 4, beds: 10, surgeries: "1,500+", experience: "8+ years avg" },
    doctors: ["Dr. Aisha Patel"],
    hod: "Dr. Aisha Patel",
    location: "Block D, Floor 1 — Room D-101 to D-108",
    timing: "OPD: Mon–Sat, 10 AM – 6 PM",
  },
  emergency: {
    name: "Emergency Care",
    fullName: "Department of Emergency & Trauma Medicine",
    icon: Ambulance,
    color: "from-red-600 to-orange-600",
    lightBg: "bg-red-50 border-red-100 text-red-600",
    description: "Our Emergency Department operates 24/7 with a Level 1 Trauma Center capability. A highly trained team of emergency physicians, nurses, and paramedics ensures rapid response to all medical emergencies.",
    facilities: ["12-Bed Emergency Room", "Trauma Bay (Level 1)", "Resuscitation Unit", "Minor Procedure Room", "Observation Ward (20 beds)", "Ambulance Bay with GPS Fleet"],
    treatments: ["Trauma & Accident Care", "Cardiac Emergency (STEMI)", "Stroke Response (Code Stroke)", "Burns & Poisoning", "Pediatric Emergency", "Obstetric Emergency", "Surgical Emergency", "Mass Casualty Management"],
    stats: { doctors: 15, beds: 32, surgeries: "10,000+", experience: "10+ years avg" },
    doctors: ["Dr. David Kim"],
    hod: "Dr. David Kim",
    location: "Ground Floor, Block A — Direct ambulance entry via Gate 3",
    timing: "24/7 — 365 days",
  },
};

const DepartmentDetailPage = () => {
  const { slug } = useParams();
  const dept = departmentData[slug];

  if (!dept) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Department Not Found</h1>
          <p className="text-slate-500 mb-6">The department you're looking for doesn't exist.</p>
          <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = dept.icon;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${dept.color} py-20 px-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                <Icon size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold">{dept.name}</h1>
                <p className="text-white/80 font-medium">{dept.fullName}</p>
              </div>
            </div>
            <p className="text-lg text-white/80 max-w-3xl mt-4 leading-relaxed">{dept.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-10 px-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Doctors', value: dept.stats.doctors, icon: Users },
            { label: 'Beds', value: dept.stats.beds, icon: Activity },
            { label: 'Procedures', value: dept.stats.surgeries, icon: Award },
            { label: 'Avg Experience', value: dept.stats.experience, icon: Clock },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${dept.lightBg} flex items-center justify-center`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Treatments */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Stethoscope size={22} className="text-blue-600" /> Treatments & Procedures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dept.treatments.map((treatment, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{treatment}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Shield size={22} className="text-indigo-600" /> Facilities & Infrastructure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dept.facilities.map((facility, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-sm text-slate-700 font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* HOD */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Head of Department</h3>
              <p className="text-lg font-bold text-slate-800">{dept.hod}</p>
              <Link to="/doctors" className="text-blue-600 text-sm font-bold mt-1 inline-flex items-center gap-1 hover:underline">
                View Profile <ArrowRight size={14} />
              </Link>
            </div>

            {/* Location */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Location</h3>
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 font-medium">{dept.location}</p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 font-medium">{dept.timing}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Link to="/appointments" className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
                <Calendar size={18} /> Book Appointment
              </Link>
              <Link to="/doctors" className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold hover:border-blue-200 transition-colors">
                <Stethoscope size={18} /> Find a Doctor
              </Link>
              <Link to="/qtrack" className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                <Activity size={18} /> QTrack Token
              </Link>
            </div>

            {/* Doctors in this dept */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Doctors in {dept.name}</h3>
              <ul className="space-y-2">
                {dept.doctors.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Stethoscope size={14} className="text-blue-500" /> {doc}
                  </li>
                ))}
              </ul>
              <Link to="/doctors" className="text-blue-600 text-sm font-bold mt-3 inline-flex items-center gap-1 hover:underline">
                View All Doctors <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetailPage;
