'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StatItem = ({ end, label, suffix = '' }: { end: number, label: string, suffix?: string }) => {
  const [hasViewed, setHasViewed] = useState(false);
  
  // A simple counter effect for visual fidelity
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (hasViewed) {
      let start = 0;
      const duration = 2000;
      const increment = Math.ceil(end / (duration / 16));
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [hasViewed, end]);

  return (
    <motion.div 
      className="text-center"
      onViewportEnter={() => setHasViewed(true)}
      viewport={{ once: true }}
    >
      <div className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base text-gray-400 max-w-[200px] mx-auto leading-relaxed">
        {label}
      </div>
    </motion.div>
  );
};

export const Statistics: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* The large oval background */}
        <div className="bg-[#111] rounded-[40px] md:rounded-[100px] py-24 md:py-36 px-6 md:px-24 text-center relative overflow-hidden">
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-20 leading-normal">
              Behind every number is a life changed—a child in school, a family fed, a voice heard. Together, we are building a future where dignity is a right, not a privilege.
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
              <StatItem end={50} suffix="k+" label="Children now have access to quality education" />
              <StatItem end={200} suffix="k" label="Meals distributed to families in need" />
              <StatItem end={10} suffix="k+" label="Lives impacted through human rights advocacy" />
            </div>
          </div>
          
          {/* Decorative faint circle in background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
};