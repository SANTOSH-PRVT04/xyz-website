import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Stethoscope, Clock, Calendar, CheckCircle, Activity, MapPin, Award, BookOpen, GraduationCap, ArrowRight, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    experience: 15,
    availability: "Mon, Wed, Fri",
    gender: "Female",
    phone: "+91 98765 11111",
    email: "sarah.jenkins@xyzhospital.com",
    room: "C-101",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    education: ["MBBS – AIIMS Delhi", "MD Cardiology – PGI Chandigarh", "Fellowship – Cleveland Clinic, USA"],
    pastWork: ["Senior Cardiologist, Apollo Hospital (2015–2020)", "Consultant, Medanta Heart Institute (2012–2015)"],
    achievements: ["500+ successful angioplasty procedures", "Published 12 research papers in international journals", "Best Doctor Award – IMA 2019"],
    bio: "Dr. Sarah Jenkins is a leading interventional cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in minimally invasive cardiac procedures and has pioneered several techniques in coronary stenting.",
    rating: 4.9, reviews: 324,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    department: "Neurology",
    specialization: "Neurovascular Surgery",
    experience: 8,
    availability: "Tue, Thu, Sat",
    gender: "Male",
    phone: "+91 98765 22222",
    email: "michael.chen@xyzhospital.com",
    room: "N-203",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    education: ["MBBS – CMC Vellore", "DM Neurology – NIMHANS Bangalore", "Fellowship Neurovascular – Johns Hopkins, USA"],
    pastWork: ["Associate Professor, NIMHANS (2018–2022)", "Consultant Neurologist, Fortis Hospital (2016–2018)"],
    achievements: ["Pioneer in endovascular stroke treatment in South India", "8 patents in neurosurgical instruments", "TEDx Speaker on Brain Health"],
    bio: "Dr. Michael Chen is a neurovascular specialist known for his expertise in stroke management and brain tumor surgery. His research on minimally invasive brain procedures has been recognized internationally.",
    rating: 4.8, reviews: 198,
  },
  {
    id: 3,
    name: "Dr. Emily Roberts",
    department: "Pediatrics",
    specialization: "Neonatal Intensive Care",
    experience: 12,
    availability: "Mon – Fri",
    gender: "Female",
    phone: "+91 98765 33333",
    email: "emily.roberts@xyzhospital.com",
    room: "P-105",
    photo: "/doctor_emily.png",
    education: ["MBBS – Lady Hardinge Medical College", "MD Pediatrics – MAMC Delhi", "Fellowship Neonatology – Great Ormond Street, London"],
    pastWork: ["Head of NICU, Sir Ganga Ram Hospital (2016–2021)", "Senior Pediatrician, Max Hospital (2013–2016)"],
    achievements: ["Saved 1000+ premature babies with advanced NICU protocols", "Introduced kangaroo mother care program", "National Award for Child Health 2020"],
    bio: "Dr. Emily Roberts is a compassionate pediatrician specializing in neonatal intensive care. She has transformed NICU outcomes through evidence-based protocols and family-centered care approaches.",
    rating: 4.9, reviews: 456,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    department: "Orthopedics",
    specialization: "Joint Replacement Surgery",
    experience: 20,
    availability: "Mon, Tue, Wed",
    gender: "Male",
    phone: "+91 98765 44444",
    email: "james.wilson@xyzhospital.com",
    room: "O-301",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    education: ["MBBS – KEM Mumbai", "MS Orthopedics – LTMMC Mumbai", "Fellowship Joint Replacement – HSS New York"],
    pastWork: ["Chief of Orthopedics, Hinduja Hospital (2010–2020)", "Visiting Surgeon, NHS UK (2008–2010)"],
    achievements: ["2000+ joint replacement surgeries", "Pioneered robotic knee replacement in India", "Lifetime Achievement Award – IOA 2022"],
    bio: "Dr. James Wilson is one of India's foremost orthopedic surgeons with two decades of experience. He has performed over 2000 joint replacements and is a pioneer in robotic-assisted surgery.",
    rating: 4.7, reviews: 512,
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    department: "Dermatology",
    specialization: "Cosmetic & Clinical Dermatology",
    experience: 6,
    availability: "Tue, Thu",
    gender: "Female",
    phone: "+91 98765 55555",
    email: "aisha.patel@xyzhospital.com",
    room: "D-102",
    photo: "/doctor_aisha.png",
    education: ["MBBS – Grant Medical College", "MD Dermatology – KEM Mumbai", "Diploma Cosmetic Medicine – Cardiff University, UK"],
    pastWork: ["Consultant Dermatologist, Kokilaben Hospital (2020–2023)", "Research Fellow, Cardiff Dermatology Institute (2019–2020)"],
    achievements: ["Published research on melanin genetics in Asian skin", "Developed proprietary acne treatment protocol", "500+ laser procedures annually"],
    bio: "Dr. Aisha Patel combines clinical dermatology with cutting-edge cosmetic procedures. She is known for her personalized skin treatment plans and expertise in laser therapies.",
    rating: 4.8, reviews: 267,
  },
  {
    id: 6,
    name: "Dr. Marcus Thorne",
    department: "Oncology",
    specialization: "Surgical Oncology",
    experience: 18,
    availability: "Wed, Fri, Sat",
    gender: "Male",
    phone: "+91 98765 66666",
    email: "marcus.thorne@xyzhospital.com",
    room: "ON-201",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    education: ["MBBS – Maulana Azad Medical College", "MS Surgery – AIIMS", "MCh Surgical Oncology – Tata Memorial Hospital"],
    pastWork: ["Head of Surgical Oncology, Tata Memorial (2012–2020)", "Visiting Professor, MD Anderson, USA (2018)"],
    achievements: ["1500+ cancer surgeries with 95% success rate", "Developed novel technique for laparoscopic cancer removal", "Padma Shri nominee for contributions to oncology"],
    bio: "Dr. Marcus Thorne is a renowned surgical oncologist with 18 years of experience. His work at Tata Memorial Hospital established new benchmarks in cancer surgery outcomes across India.",
    rating: 4.9, reviews: 389,
  },
  {
    id: 7,
    name: "Dr. Sophia Lauren",
    department: "General Medicine",
    specialization: "Internal Medicine & Preventive Health",
    experience: 4,
    availability: "Mon – Sat",
    gender: "Female",
    phone: "+91 98765 77777",
    email: "sophia.lauren@xyzhospital.com",
    room: "G-104",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
    education: ["MBBS – Kasturba Medical College", "MD Internal Medicine – St. John's Bangalore"],
    pastWork: ["Junior Consultant, Manipal Hospital (2022–2024)", "Resident, St. John's Medical College (2020–2022)"],
    achievements: ["Top performer in DNB examinations", "Published 3 papers on lifestyle diseases in India", "Community health camp volunteer — 50+ camps"],
    bio: "Dr. Sophia Lauren is a dedicated internist focused on preventive healthcare and chronic disease management. She believes in a holistic, patient-first approach to medicine.",
    rating: 4.6, reviews: 156,
  },
  {
    id: 8,
    name: "Dr. David Kim",
    department: "Emergency Care",
    specialization: "Emergency & Trauma Medicine",
    experience: 10,
    availability: "24/7 Shifts",
    gender: "Male",
    phone: "+91 98765 88888",
    email: "david.kim@xyzhospital.com",
    room: "ER-01",
    photo: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop",
    education: ["MBBS – Armed Forces Medical College", "MD Emergency Medicine – CMC Vellore", "ACLS & ATLS Certified"],
    pastWork: ["Emergency Medicine Lead, Army Hospital R&R (2016–2021)", "Flight Surgeon, Indian Air Force (2014–2016)"],
    achievements: ["Managed mass casualty incidents with 98% survival rate", "Trained 200+ emergency medicine residents", "National Emergency Medicine Excellence Award 2021"],
    bio: "Dr. David Kim brings military precision to emergency medicine. With combat medical experience and advanced trauma training, he leads our 24/7 emergency response team.",
    rating: 4.9, reviews: 445,
  },
];

const departmentsList = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "Oncology", "General Medicine", "Emergency Care"];

const FindDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "All" || doctor.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept]);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 py-16 px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20">
              <Stethoscope size={16} /> Find a Specialist
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Medical Experts</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">Find the right specialist for your needs. View profiles, experience, and book appointments directly.</p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search by name, specialty, or department..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white" />
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {departmentsList.map(dept => (
              <button key={dept} onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedDept === dept ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200'}`}>
                {dept === "All" ? "All Departments" : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="pb-16 px-6 max-w-6xl mx-auto">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, i) => (
              <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => setSelectedDoctor(doctor)}
              >
                {/* Photo */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-amber-400" fill="currentColor" />
                    <span className="text-xs font-bold text-slate-800">{doctor.rating}</span>
                    <span className="text-xs text-slate-400">({doctor.reviews})</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">{doctor.department}</span>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{doctor.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{doctor.specialization}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Award size={12} className="text-blue-500" /> {doctor.experience} yrs exp
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <MapPin size={12} className="text-blue-500" /> Room {doctor.room}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Clock size={12} className="text-blue-500" /> {doctor.availability}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                      View Profile
                    </button>
                    <Link to="/appointments" onClick={e => e.stopPropagation()}
                      className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors text-center">
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Doctors Found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearchTerm(""); setSelectedDept("All"); }}
              className="py-2.5 px-6 rounded-xl font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Clear Filters</button>
          </div>
        )}
      </section>

      {/* Doctor Profile Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedDoctor(null)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 rounded-t-3xl"></div>
                <button onClick={() => setSelectedDoctor(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
                  <X size={18} />
                </button>
                <div className="flex items-end gap-5 px-8 -mt-16 relative z-10">
                  <img src={selectedDoctor.photo} alt={selectedDoctor.name}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg" />
                  <div className="pb-2">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedDoctor.name}</h2>
                    <p className="text-blue-600 font-semibold">{selectedDoctor.specialization}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} /> Room {selectedDoctor.room}</span>
                      <span className="flex items-center gap-1 text-sm"><Star size={14} className="text-amber-400" fill="currentColor" /> {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">About</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedDoctor.bio}</p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Department', value: selectedDoctor.department, icon: Activity },
                    { label: 'Experience', value: `${selectedDoctor.experience} Years`, icon: Award },
                    { label: 'Available', value: selectedDoctor.availability, icon: Calendar },
                    { label: 'Room', value: selectedDoctor.room, icon: MapPin },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <item.icon size={16} className="text-blue-500 mb-1" />
                      <p className="text-xs text-slate-400 font-bold uppercase">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><GraduationCap size={20} className="text-blue-600" /> Education</h3>
                  <div className="space-y-2">
                    {selectedDoctor.education.map((edu, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-sm text-slate-700 font-medium">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Work */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><BookOpen size={20} className="text-indigo-600" /> Past Experience</h3>
                  <div className="space-y-2">
                    {selectedDoctor.pastWork.map((work, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                        <Stethoscope size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-700 font-medium">{work}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Award size={20} className="text-amber-500" /> Key Achievements</h3>
                  <div className="space-y-2">
                    {selectedDoctor.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                        <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-700 font-medium">{ach}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & CTA */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <p><strong>Email:</strong> {selectedDoctor.email}</p>
                      <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
                    </div>
                    <div className="flex gap-3">
                      <Link to="/qtrack" className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors flex items-center gap-1.5">
                        <Activity size={16} /> QTrack Token
                      </Link>
                      <Link to="/appointments" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md">
                        <Calendar size={16} /> Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindDoctorsPage;
