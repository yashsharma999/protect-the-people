'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import { Globe } from '@/components/ui/globe';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-[#8D8B9C] pt-24 pb-8 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Interactive 3D Globe */}
        <div className="flex justify-center mb-20 relative">
          <div className="w-[24rem] h-[24rem] md:w-[36rem] md:h-[36rem] lg:w-[44rem] lg:h-[44rem] relative flex items-center justify-center">
             <Globe 
               className="opacity-90"
               config={{
                 width: 1000,
                 height: 1000,
                 devicePixelRatio: 2,
                 phi: 0,
                 theta: 0.3,
                 dark: 1,
                 diffuse: 1.2,
                 mapSamples: 16000,
                 mapBrightness: 6,
                 baseColor: [0.13, 0.15, 0.2],
                markerColor: [0.55, 0.69, 0.87],
                glowColor: [0.55, 0.69, 0.87],
                markers: [
                  { location: [28.6, 77.2], size: 0.1 },   // New Delhi
                 
                  { location: [22.6, 88.4], size: 0.07 },  // Kolkata
                  
                  { location: [18.5, 73.9], size: 0.04 },  // Pune
                ],
                 onRender: () => {},
               }}
             />
             
             <motion.span 
               initial={{ opacity: 0.8 }}
               animate={{ opacity: [0.8, 1, 0.8] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="font-script text-[#8D8B9C] text-5xl md:text-7xl absolute z-10 text-center transform -rotate-6 drop-shadow-[0_2px_10px_rgba(204,255,0,0.3)]"
             >
               Protect<br/>The People
             </motion.span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end pt-8 gap-4">
          <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-500">
            <span>ProtectThePeople, 2026. All rights reserved</span>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          </div>
          
          <div className="flex gap-4">
             <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer">
               <Facebook size={16} />
             </a>
             <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer">
               <Instagram size={16} />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};