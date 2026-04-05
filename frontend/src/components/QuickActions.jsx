import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, Ambulance, Activity, ShieldPlus, Ticket } from 'lucide-react';

const actions = [
  {
    title: 'Book Appointment',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-600',
    path: '/appointments',
  },
  {
    title: 'Find Doctor',
    icon: Stethoscope,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverBg: 'hover:bg-teal-600',
    path: '/doctors',
  },
  {
    title: 'Emergency Care',
    icon: Ambulance,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    hoverBg: 'hover:bg-red-500',
    path: '/emergency',
  },
  {
    title: 'Diagnostics',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-600',
    path: '/diagnostics',
  },
  {
    title: 'Health Packages',
    icon: ShieldPlus,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverBg: 'hover:bg-emerald-600',
    path: '/packages',
  },
  {
    title: 'QTrack Token',
    icon: Ticket,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-500',
    path: '/qtrack',
  },
];

const QuickActions = () => {
  return (
    <section className="w-full relative -mt-24 z-20 px-6 md:px-12 lg:px-24 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border border-slate-100/50 bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-xl shadow-slate-200/50">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link 
                to={action.path}
                key={index}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-full ${action.bgColor} ${action.color} flex items-center justify-center mb-4 transition-colors duration-300 group-${action.hoverBg} group-hover:text-white`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 text-center leading-tight">
                  {action.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
