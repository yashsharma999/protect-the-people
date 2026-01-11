'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

const stories = [
  {
    id: '1',
    title: 'Bridging the Gap: Rural Education',
    excerpt: 'Quality education is a fundamental right that is effectively breaking the cycle of poverty and empowering the next generation across India.',
    author: 'Mohit Sharma',
    readTime: '5 min read',
    image: '/story_education.jpeg',
    avatar: '/author.jpeg'
  },
  {
    id: '2',
    title: 'Nourishing Hope: The Zero Hunger Mission',
    excerpt: 'Dignity is a fundamental right that is deeply rooted in the security of a daily meal.',
    author: 'Mohit Sharma',
    readTime: '13 min read',
    image: '/story_hunger.jpeg',
    avatar: '/author.jpeg'
  },
  {
    id: '3',
    title: 'Restoring Dignity: Rights for All',
    excerpt: 'Justice is a fundamental pillar that is deeply essential to the safety and equality of our people.',
    author: 'Mohit Sharma',
    readTime: '6 min read',
    image: '/story_rights.jpeg',
    avatar: '/author.jpeg'
  }
];

export const Stories: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sticky Left Column */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32">
               <span className="text-sm font-bold tracking-widest text-gray-500 mb-6 block uppercase">Our Stories</span>
               <h2 className="text-2xl md:text-3xl font-serif leading-tight text-gray-900 mb-10">
               These are the voices of communities we've walked alongside—stories of children finding hope in classrooms, families receiving their next meal, and people reclaiming their fundamental rights.
               </h2>
               <div className="hidden lg:block">
                 <Button variant="ghost" className="rounded-none border-b border-black px-0 py-2 text-lg hover:bg-transparent">Show all stories</Button>
               </div>
             </div>
          </div>

          {/* Scrollable Right Column */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            {stories.map((story, idx) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-8 items-center border-b border-gray-200 pb-16 last:border-0"
              >
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                         <img src={story.avatar} alt={story.author} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-base font-semibold text-gray-900">{story.author}</span>
                  </div>
                  <h3 className="text-3xl font-serif mb-4 group-hover:text-gray-600 transition-colors cursor-pointer">{story.title}</h3>
                  <p className="text-gray-500 text-lg mb-4 line-clamp-2">{story.excerpt}</p>
                  <span className="text-sm text-gray-400 font-medium">{story.readTime}</span>
                </div>
                
                <div className="w-full md:w-56 h-56 flex-shrink-0 order-1 md:order-2 overflow-hidden rounded-xl">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
             <div className="lg:hidden mt-8">
                 <Button variant="ghost" className="w-full justify-center text-lg">Show all stories</Button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};