'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

export const Profile: React.FC = () => {
  return (
    <section className="py-32 bg-white" id="about-us">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Image */}
          <div className="relative w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
              <div className="absolute inset-0 rounded-full border border-gray-200 transform rotate-6 scale-105"></div>
              <img 
                src="/author.jpeg" 
                alt="Founder" 
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <motion.span 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-6 font-script text-accent text-4xl md:text-5xl transform -rotate-6 z-10"
            >
              Sanjay Sharma
            </motion.span>
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2">
             <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 block">About</span>
             <h2 className="text-3xl md:text-4xl font-serif leading-relaxed mb-8">
               Sanjay Sharma is an academic, human rights advocate, and a police officer. He amplifies the voices of the poor and underprivileged.
             </h2>
             <p className="text-gray-500 text-lg mb-10 leading-relaxed">
               Sanjay helps people who are struggling and facing difficulties. His impactful work has gained recognition, and he is determined to change the system for the better.
             </p>
             <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none px-0 border-t-0 border-l-0 border-r-0 border-b pb-2 text-lg">
               More leading to about us
             </Button>
          </div>

        </div>
      </div>
    </section>
  );
};