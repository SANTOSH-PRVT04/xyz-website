import React, { useState, useMemo } from 'react';
import { Search, Filter, Stethoscope, Clock, Calendar, CheckCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    department: "Cardiology",
    experience: 15,
    availability: "Mon, Wed, Fri",
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    department: "Neurology",
    experience: 8,
    availability: "Tue, Thu, Sat",
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Dr. Emily Roberts",
    department: "Pediatrics",
    experience: 12,
    availability: "Mon - Fri",
    gender: "Female",
    photo: "/doctor_emily.png" 
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    department: "Orthopedics",
    experience: 20,
    availability: "Mon, Tue, Wed",
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" 
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    department: "Dermatology",
    experience: 6,
    availability: "Tue, Thu",
    gender: "Female",
    photo: "/doctor_aisha.png" 
  },
  {
    id: 6,
    name: "Dr. Marcus Thorne",
    department: "Oncology",
    experience: 18,
    availability: "Wed, Fri, Sat",
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" 
  },
  {
    id: 7,
    name: "Dr. Sophia Lauren",
    department: "General Medicine",
    experience: 4,
    availability: "Mon - Sat",
    gender: "Female",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop" 
  },
  {
    id: 8,
    name: "Dr. David Kim",
    department: "Emergency Care",
    experience: 10,
    availability: "24/7 Shifts",
    gender: "Male",
    photo: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop" 
  }
];

const departmentsList = ["All", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "Oncology", "General Medicine", "Emergency Care"];
const experienceList = ["All", "0-5 Years", "5-15 Years", "15+ Years"];
const genderList = ["All", "Male", "Female"];

const DoctorsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");

  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      // Name Match
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Department Match
      const matchesDept = selectedDept === "All" || doctor.department === selectedDept;
      
      // Gender Match
      const matchesGender = selectedGender === "All" || doctor.gender === selectedGender;
      
      // Experience Match
      let matchesExp = true;
      if (selectedExp === "0-5 Years") matchesExp = doctor.experience <= 5;
      if (selectedExp === "5-15 Years") matchesExp = doctor.experience > 5 && doctor.experience <= 15;
      if (selectedExp === "15+ Years") matchesExp = doctor.experience > 15;

      return matchesSearch && matchesDept && matchesGender && matchesExp;
    });
  }, [searchTerm, selectedDept, selectedExp, selectedGender]);

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white" id="doctors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block py-1.5 px-4 rounded-full text-blue-700 font-bold tracking-widest uppercase text-xs mb-5 bg-blue-50 border border-blue-100">
            Expert Care
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Meet Our <span className="text-blue-600">Specialists</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find the right expert for your healthcare needs. Utilize our QTrack token system to jump directly into the digital queue.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-2xl mb-12 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-1 w-full gap-4">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="All" disabled>Department</option>
              {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select 
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="All" disabled>Experience</option>
              {experienceList.map(e => <option key={e} value={e}>{e === "All" ? "All Experiences" : e}</option>)}
            </select>

            <select 
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="All" disabled>Gender</option>
              {genderList.map(g => <option key={g} value={g}>{g === "All" ? "All Genders" : g}</option>)}
            </select>
            
            {(searchTerm || selectedDept !== "All" || selectedExp !== "All" || selectedGender !== "All") && (
              <button 
                onClick={() => { setSearchTerm(""); setSelectedDept("All"); setSelectedExp("All"); setSelectedGender("All"); }}
                className="py-3.5 px-6 rounded-xl font-medium text-slate-600 hover:bg-slate-200/50 transition whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                {/* Photo Header */}
                <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={doctor.photo} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-blue-600">
                    <CheckCircle size={14} fill="currentColor" className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wide">Available</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-blue-600 font-bold text-sm mb-1 uppercase tracking-wider">{doctor.department}</span>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{doctor.name}</h3>
                  
                  <div className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Stethoscope size={18} className="text-blue-500" />
                      <span>{doctor.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                       <Clock size={18} className="text-blue-500" />
                       <span>{doctor.availability}</span>
                    </div>
                  </div>

                  {/* Built-in Margin Top to push buttons down */}
                  <div className="mt-auto flex flex-col gap-4">
                     
                     <div className="flex flex-col gap-1.5">
                       <Link to="/appointments" className="w-full text-center py-2.5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-700 text-slate-700 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2">
                         <Calendar size={18} /> Schedule Appointment
                       </Link>
                       <span className="text-center text-[11.5px] leading-tight text-slate-500 font-medium tracking-wide">Book for a specific date & time</span>
                     </div>

                     <div className="flex flex-col gap-1.5">
                       <Link to="/qtrack" className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 pb-2.5">
                         <Activity size={18} strokeWidth={2.5} /> Join Live Queue (QTrack)
                       </Link>
                       <span className="text-center text-[11.5px] leading-tight text-slate-500 font-medium tracking-wide">Get instant token & track live queue</span>
                     </div>
                     
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Specialists Found</h3>
            <p className="text-slate-500">We couldn't find any doctors matching your current filters. Try adjusting your search criteria.</p>
            <button 
                onClick={() => { setSearchTerm(""); setSelectedDept("All"); setSelectedExp("All"); setSelectedGender("All"); }}
                className="mt-6 py-2.5 px-6 rounded-xl font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                Clear All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default DoctorsSection;
