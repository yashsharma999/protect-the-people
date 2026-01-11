'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Matches the center image of preloader roughly in tone */}
      <div className="absolute inset-0">
        <img 
          src="/hero.jpg" 
          alt="Hero background" 
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90 opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-[1400px] w-full"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight">
            Protecting People, Empowering Communities
          </h1>
          
          <div className="relative mt-4 md:mt-8 h-32 md:h-40 w-full flex justify-center">
            {/* Handwritten overlay positioned absolutely */}
            <motion.span 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="font-script text-accent text-4xl md:text-6xl lg:text-7xl absolute transform -rotate-6 top-0"
            >
              building a brighter tomorrow
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};