import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Building2, Bed, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';

const stats = [
  { label: 'Specialist Doctors', value: '150+', icon: Stethoscope },
  { label: 'Departments', value: '45+', icon: Building2 },
  { label: 'Beds', value: '500+', icon: Bed },
  { label: 'Emergency Care', value: '24/7', icon: Clock },
  { label: 'Patients Daily', value: '1000+', icon: Users },
];

const images = [
  '/about_bg_user.jpg', 
  '/doctors_working.png',
  '/patient_care.png',
  '/hospital_room.png',
  '/surgery_room.png'
];

const AboutSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextImage = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 100 : -100,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0,
      };
    },
  };

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-white relative" id="about">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side (Content Area) */}
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
          <span className="inline-block py-1.5 px-4 rounded-full text-blue-700 font-bold tracking-widest uppercase text-xs mb-5 bg-blue-50 border border-blue-100">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-slate-800 mb-6 leading-tight tracking-tight">
            A Legacy of Uncompromising <br className="hidden lg:block"/>
            <span className="text-blue-600">Healthcare Excellence</span>
          </h2>
          <p className="text-lg text-slate-600 mb-12 leading-relaxed font-normal max-w-2xl">
            At XYZ Hospital, we integrate world-class medical expertise with the latest in healthcare technology to offer uncompromising care. Our commitment extends beyond treatment to patient comfort, pioneered further by our revolutionary QTrack smart queue management system, ensuring that your health remains our only priority without the burden of waiting.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-start gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="bg-white text-blue-600 p-2.5 rounded-lg shrink-0 shadow-sm border border-slate-100">
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-none mb-1.5">{stat.value}</h4>
                    <span className="text-[13px] text-slate-500 font-medium tracking-wide leading-tight">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side (Interactive Image Section) */}
        <div className="w-full lg:w-[45%] relative h-[450px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 group">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={index}
              src={images[index]}
              alt="XYZ Hospital Setup"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4 px-6 pointer-events-none z-20">
            <button 
              onClick={prevImage}
              className="pointer-events-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>
            <button 
              onClick={nextImage}
              className="pointer-events-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
             {images.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => {
                   setDirection(i > index ? 1 : -1);
                   setIndex(i);
                 }}
                 className={`h-2 rounded-full transition-all duration-500 shadow-sm ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/80 hover:bg-white'}`} 
               />
             ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
