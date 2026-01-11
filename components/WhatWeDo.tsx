'use client';

import React from 'react';
import { motion } from 'framer-motion';

const items = [
  { id: 1, title: 'Child Education', image: '/child_edu.jpeg' },
  { id: 2, title: 'Food Aid', image: '/food_aid.jpeg' },
  { id: 3, title: 'Human Rights', image: '/human_rights.jpeg' },
];

export const WhatWeDo: React.FC = () => {
  return (
    <section className="py-32 bg-white overflow-hidden" id="about-us">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-serif mb-20 text-black"
        >
          What we do
        </motion.h2>

        <div className="flex flex-wrap md:flex-nowrap justify-center gap-10 lg:gap-16">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative w-72 h-72 md:w-96 md:h-96 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0"
            >
              {/* Default State: Text */}
              <span className="font-sans text-2xl font-medium text-black group-hover:opacity-0 transition-opacity duration-300 z-10">
                {item.title}
              </span>

              {/* Hover State: Image + Script Text */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <span className="absolute z-20 font-script text-white text-4xl md:text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-rotate-12 translate-y-4 group-hover:translate-y-0 text-center px-4">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto mt-24 text-center">
            <p className="text-gray-600 text-xl leading-relaxed font-light">
                We are a non-profit charity dedicated to raising funds and providing support for those in need. Through education, nutrition, and advocacy, we empower communities and protect the rights of every individual.
            </p>
        </div>
      </div>
    </section>
  );
};