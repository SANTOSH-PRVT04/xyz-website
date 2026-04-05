import React from 'react';
import { HeartPulse, Brain, Activity, Baby, Microscope, Pill, Sparkles, Ambulance, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const departments = [
  {
    name: "Cardiology",
    description: "Advanced heart care, diagnostics, and surgical treatments by leading cardiologists.",
    icon: HeartPulse,
    link: "/departments/cardiology"
  },
  {
    name: "Neurology",
    description: "Comprehensive care for neurological disorders, stroke, and brain health.",
    icon: Brain,
    link: "/departments/neurology"
  },
  {
    name: "Orthopedics",
    description: "State-of-the-art treatments for bone, joint, and spine conditions.",
    icon: Activity,
    link: "/departments/orthopedics"
  },
  {
    name: "Pediatrics",
    description: "Specialized, compassionate healthcare for infants, children, and adolescents.",
    icon: Baby,
    link: "/departments/pediatrics"
  },
  {
    name: "Oncology",
    description: "Expert cancer care, chemotherapy, and radiation therapy with a patient-first approach.",
    icon: Microscope,
    link: "/departments/oncology"
  },
  {
    name: "General Medicine",
    description: "Complete primary care, preventive screenings, and chronic disease management.",
    icon: Pill,
    link: "/departments/medicine"
  },
  {
    name: "Dermatology",
    description: "Advanced treatments for skin conditions, cosmetic procedures, and skin health.",
    icon: Sparkles,
    link: "/departments/dermatology"
  },
  {
    name: "Emergency Care",
    description: "24/7 rapid response unit fully equipped to handle all medical emergencies swiftly.",
    icon: Ambulance,
    link: "/departments/emergency"
  }
];

const DepartmentsSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-50 relative" id="departments">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full text-blue-700 font-bold tracking-widest uppercase text-xs mb-5 bg-blue-100/50 border border-blue-200">
            Center of Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Our Medical <span className="text-blue-600">Specialties</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our diverse range of medical departments, each equipped with world-class technology and led by industry-leading specialists.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <div 
                key={index} 
                className="group flex flex-col bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-blue-600 mb-6 flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon size={26} strokeWidth={2} />
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-slate-500 text-[15px] leading-relaxed mb-8 flex-grow">
                  {dept.description}
                </p>

                {/* Learn More Button */}
                <Link 
                  to={dept.link}
                  className="mt-auto flex items-center gap-2 text-blue-600 font-semibold text-sm tracking-wide group-hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight size={16} strokeWidth={3} className="pt-[1px]"/>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default DepartmentsSection;
