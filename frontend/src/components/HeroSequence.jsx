import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroSequence = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalFrames = 170;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Progressive frame loading — load in priority batches
  useEffect(() => {
    let loadedCount = 0;
    const imgs = new Array(totalFrames);

    // Priority batch: load every 5th frame first for instant preview, then fill in
    const priorityOrder = [];
    for (let i = 0; i < totalFrames; i += 5) priorityOrder.push(i);
    for (let i = 0; i < totalFrames; i++) {
      if (!priorityOrder.includes(i)) priorityOrder.push(i);
    }

    const loadBatch = (startIdx) => {
      const batchSize = 10;
      const end = Math.min(startIdx + batchSize, priorityOrder.length);
      
      for (let b = startIdx; b < end; b++) {
        const i = priorityOrder[b];
        const img = new Image();
        const frameNumber = (i + 1).toString().padStart(3, '0');
        img.src = `/ezgif-3b3e06081400d33c-png-split/ezgif-frame-${frameNumber}.png`;
        img.onload = () => {
          loadedCount++;
          imgs[i] = img;
          imagesRef.current = imgs;
          const pct = Math.round((loadedCount / totalFrames) * 100);
          setLoadProgress(pct);
          if (loadedCount >= totalFrames * 0.3 && !isReady) setIsReady(true);
          if (pct === 100) setIsReady(true);
        };
        img.onerror = () => { loadedCount++; };
      }

      if (end < priorityOrder.length) {
        setTimeout(() => loadBatch(end), 16); // Yield to main thread between batches
      }
    };

    loadBatch(0);
    return () => { imagesRef.current = []; };
  }, []);

  // RAF-based canvas rendering — smooth 60fps
  const renderFrame = useCallback((progress) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)));
    if (frameIndex === lastFrameRef.current) return; // Skip if same frame
    lastFrameRef.current = frameIndex;

    // Find the nearest loaded frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete) {
      // Fallback: find closest loaded frame
      for (let offset = 1; offset < 10; offset++) {
        const below = imagesRef.current[frameIndex - offset];
        const above = imagesRef.current[frameIndex + offset];
        if (below && below.complete) { img = below; break; }
        if (above && above.complete) { img = above; break; }
      }
    }
    if (!img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    }
    
    const scale = Math.max(w / img.width, h / img.height);
    const x = (w - img.width * scale) / 2;
    const y = (h - img.height * scale) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => renderFrame(v));
    });
    
    // Render first frame immediately
    renderFrame(0);

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, scrollYProgress, renderFrame]);

  // Text visible immediately — fades out DURING scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 0]);
  // CTA badge visible from start
  const badgeScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-slate-900">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Loading screen */}
        {!isReady && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-white text-xl font-medium mb-2">Loading Experience</p>
            <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-300" style={{ width: `${loadProgress}%` }}></div>
            </div>
            <p className="text-slate-500 text-sm mt-2">{loadProgress}%</p>
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20 z-10"
          style={{ opacity: overlayOpacity }}
        />

        {/* Welcome Text — VISIBLE IMMEDIATELY */}
        <motion.div 
          className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start justify-end pb-28 text-left h-full"
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium tracking-widest uppercase">
              Leading Medical Excellence
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="font-light text-slate-200 block mb-1 text-3xl md:text-4xl lg:text-5xl">Welcome to</span>
            XYZ Hospital
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-lg text-slate-200 mb-8 font-normal leading-relaxed max-w-xl drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Experience seamless clinical excellence powered by our{' '}
            <span className="font-semibold text-white">QTrack</span>{' '}
            Digital Queue System. Zero waiting time, smart token management, and priority care — all at your fingertips.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link to="/appointments" className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5">
              Book Appointment <ArrowRight size={18} />
            </Link>
            <Link to="/qtrack" className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5">
              QTrack Portal <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          style={{ opacity: textOpacity }}
        >
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <ChevronDown size={20} className="text-white/50 animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSequence;
