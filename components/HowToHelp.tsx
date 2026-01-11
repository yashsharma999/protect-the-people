import React from 'react';
import { Utensils, GraduationCap, HandHeart } from 'lucide-react';
import { Button } from './ui/Button';

const options = [
  {
    icon: <GraduationCap size={28} />,
    title: "Donate for education",
    desc: "Help children access quality education by providing books, school supplies, and learning materials to underserved communities.",
    button: "Donate now",
  },
  {
    icon: <Utensils size={28} />,
    title: "Provide food aid",
    desc: "Your contribution helps deliver nutritious meals and essential food supplies to families in need. Every donation makes a difference.",
    button: "Support a family",
  },
  {
    icon: <HandHeart size={28} />,
    title: "Volunteer with us",
    desc: "We welcome volunteers from legal, public sector, or any background. Share your expertise and time to help amplify voices that need to be heard.",
    button: "Become a volunteer",
  },
];

export const HowToHelp: React.FC = () => {
  return (
    <section className="py-32 bg-gray-50" id="how-to-help">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-serif mb-20">How can you help us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {options.map((opt, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 flex flex-col items-start transition-shadow hover:shadow-xl duration-300 group">
              <div className="mb-8 p-4 bg-gray-50 rounded-full text-black group-hover:bg-lime group-hover:text-black transition-colors duration-300">
                {opt.icon}
              </div>
              <h3 className="text-3xl font-serif mb-5">{opt.title}</h3>
              <p className="text-gray-500 text-lg mb-10 flex-grow leading-relaxed">
                {opt.desc}
              </p>
              <Button variant="ghost" className="rounded-full border-gray-200 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all text-base px-8 py-3">
                {opt.button}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};