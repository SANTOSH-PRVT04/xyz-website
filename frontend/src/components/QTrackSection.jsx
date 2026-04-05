import React from 'react';
import { Ticket, Activity, Clock, BellRing, Laptop, Settings, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Digital Token Generation",
    description: "Secure your place in line instantly from your phone before you even arrive at the hospital.",
    icon: Ticket
  },
  {
    title: "Live Queue Tracking",
    description: "Monitor your exact position in the queue with real-time updates and patient flow tracking.",
    icon: Activity
  },
  {
    title: "Estimated Arrival Time",
    description: "Smart algorithms calculate precisely when you need to be present, drastically reducing physical waiting.",
    icon: Clock
  },
  {
    title: "Token Expiry Alert",
    description: "Receive push notifications and SMS alerts when your turn is approaching or if you risk losing your slot.",
    icon: BellRing
  },
  {
    title: "Doctor Queue Dashboard",
    description: "Physicians get a sleek, synchronized overview of waiting patients to manage their daily schedules efficiently.",
    icon: Laptop
  },
  {
    title: "Admin Queue Control",
    description: "Administrators have full command over queue prioritization, VIP access, and emergency overrides.",
    icon: Settings
  }
];

const QTrackSection = () => {
  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-24 bg-slate-900 border-y border-slate-800 overflow-hidden" id="qtrack">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFoLTM4djM4aDM4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Top Header */}
        <div className="w-full text-center flex flex-col items-center mb-16">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest text-xs mb-6 backdrop-blur-sm shadow-sm">
            <Zap size={14} className="text-yellow-400 fill-yellow-400/20" />
            <span>Integrated Technology</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight max-w-3xl">
            QTrack – Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Digital Queue System</span>
          </h2>
          
          <p className="text-lg text-slate-300 md:leading-relaxed max-w-3xl">
            Revolutionizing the hospital experience. Generate tokens digitally, track your queue status live, and check precise estimated arrival times to entirely eliminate physical waiting rooms.
          </p>
        </div>

        {/* Feature Grid - 3 columns, smaller horizontal boxes */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 mb-14">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 group hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 tracking-wide leading-tight">{feature.title}</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTAs Centered at bottom */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link 
              to="/qtrack" 
              className="flex items-center justify-center gap-2 py-3.5 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm lg:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-[1px]"
            >
              Go to QTrack
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            
            <button className="flex items-center justify-center gap-2 py-3.5 px-8 bg-slate-800/80 hover:bg-slate-800 border border-blue-400/30 hover:border-blue-400 text-white rounded-xl font-bold text-sm lg:text-base backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:-translate-y-[1px]">
              <Ticket size={18} />
              Generate Token
            </button>
        </div>

      </div>
    </section>
  );
};

export default QTrackSection;
