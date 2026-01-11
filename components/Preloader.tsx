'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Show Grid
    const timer1 = setTimeout(() => setStage(1), 500);
    // Stage 2: Collapse to center
    const timer2 = setTimeout(() => setStage(2), 2000);
    // Stage 3: Finish
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Use fixed random images for the grid
  const images = [
    "https://picsum.photos/800/800?random=1",
    "https://picsum.photos/800/800?random=2",
    "https://picsum.photos/800/800?random=3",
    "https://picsum.photos/800/800?random=4",
    "https://picsum.photos/800/800?random=5", // Center image
    "https://picsum.photos/800/800?random=6",
    "https://picsum.photos/800/800?random=7",
    "https://picsum.photos/800/800?random=8",
    "https://picsum.photos/800/800?random=9",
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full max-w-4xl max-h-[100vh] gap-2 p-2">
        {images.map((src, index) => {
          const isCenter = index === 4;
          
          return (
            <motion.div
              key={index}
              className="relative w-full h-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: stage === 0 ? 0 : stage === 1 ? 1 : isCenter ? 1 : 0,
                scale: stage === 0 ? 0.8 : stage === 1 ? 1 : isCenter ? 5 : 0.5, // Center expands massively
                zIndex: isCenter ? 50 : 1
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img 
                src={src} 
                alt="Loading" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>
      
      {stage < 2 && (
        <motion.div 
          className="absolute bottom-10 left-0 right-0 text-center text-white font-serif text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Gathering voices...
        </motion.div>
      )}
    </motion.div>
  );
};