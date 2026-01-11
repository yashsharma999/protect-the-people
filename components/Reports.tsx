import React from 'react';
import { FileText } from 'lucide-react';

const reports = [
  { title: "Annual report 2024-2025: Rural Education Initiative in Rajasthan", date: "15 Jan 2025" },
  { title: "Report 2024: Mid-day Meal Program Impact Study", date: "22 Nov 2024" },
  { title: "Report 2023-2024: Women's Rights Awareness in Uttar Pradesh", date: "08 Aug 2024" },
  { title: "Report 2024: Digital Literacy for Tribal Communities", date: "30 May 2024" },
];

export const Reports: React.FC = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
           <h2 className="text-4xl md:text-6xl font-serif">Reports & documentation</h2>
           <button className="hidden md:block text-base font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors">
             More reports
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, i) => (
            <a key={i} href="#" className="group block bg-gray-50 p-8 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <FileText size={16} /> PDF Format
                </span>
              </div>
              <h3 className="text-2xl font-medium mb-5 group-hover:text-blue-600 transition-colors">{report.title}</h3>
              <p className="text-base text-gray-400">{report.date}</p>
            </a>
          ))}
        </div>
        
        <div className="mt-16 p-10 bg-lime/10 rounded-2xl text-base text-gray-700 max-w-3xl">
          We prioritize transparency as we believe it is crucial to foster trust and accountability in our actions and initiatives.
        </div>
      </div>
    </section>
  );
};