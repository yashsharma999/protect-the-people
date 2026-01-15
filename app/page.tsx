import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { WhatWeDo } from '@/components/WhatWeDo';
import { Stories } from '@/components/Stories';
import { Statistics } from '@/components/Statistics';
import { HowToHelp } from '@/components/HowToHelp';
import { Reports } from '@/components/Reports';
import { Profile } from '@/components/Profile';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <WhatWeDo />
        <Stories />
        <Statistics />
        <HowToHelp />
        <div className="bg-gradient-to-b from-gray-50 to-white">
            {/* Decorative section for quote */}
            <div className="bg-[#1a2e35] text-white py-24 my-16 mx-4 md:mx-12 rounded-[3rem] relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed max-w-4xl mx-auto mb-6 opacity-90">
                        "The highest education is that which does not merely give us information but makes our life in harmony with all existence."
                    </blockquote>
                    <cite className="block text-base font-bold tracking-widest uppercase opacity-60 not-italic mb-8">- Rabindranath Tagore</cite>
                    
                    <span className="font-script text-lime text-2xl md:text-3xl opacity-80 inline-block transform -rotate-6">
                        Path to Empowerment
                    </span>
                </div>
            </div>
            <Reports />
            {/* <Profile /> */}
        </div>
      </main>
      <Footer />
    </div>
  );
}

