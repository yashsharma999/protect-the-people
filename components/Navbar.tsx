'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from './ui/Button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface NavbarProps {
  forceScrolled?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ forceScrolled = false }) => {
  const [isHeroSection, setIsHeroSection] = useState(!forceScrolled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If forceScrolled is true, always show the scrolled/white navbar
    if (forceScrolled) {
      setIsHeroSection(false);
      return;
    }

    const handleScroll = () => {
      // Switch theme when the user scrolls past the hero section (viewport height)
      // We subtract a buffer (80px) so the transition happens just as the next section hits the navbar
      const heroHeight = window.innerHeight;
      const buffer = 80; 
      setIsHeroSection(window.scrollY < heroHeight - buffer);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceScrolled]);

  // Theme Styles
  // Hero: Dark glass, consistent, no change on minor scrolls
  // Content: Light glass, dark text
  const navBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-b";
  const navThemeClasses = isHeroSection 
    ? "bg-[#050505]/40 backdrop-blur-2xl border-white/5" 
    : "bg-white/80 backdrop-blur-xl border-black/5 shadow-sm";

  const textClass = isHeroSection ? "text-white" : "text-black";
  const subTextClass = isHeroSection ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black";
  
  // Component specific styles
  const dividerClass = isHeroSection ? "bg-white/20" : "bg-black/10";
  
  const donateBtnClass = isHeroSection
    ? "text-white hover:text-white/80"
    : "text-black hover:text-black/70";
    
  const contactBtnClass = isHeroSection
    ? "text-white/80 hover:text-white"
    : "text-black/70 hover:text-black";

  return (
    <nav className={`${navBaseClasses} ${navThemeClasses}`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-0">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
           <img 
             src="/logo.png" 
             alt="PTPF Logo" 
             className="h-10 w-auto transition-all duration-500"
           />
           <span className={`font-bold tracking-tight text-xl font-sans transition-colors duration-500 ${textClass}`}>ProtectThePeople</span>
        </div>

        {/* Center Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          {['How to help', 'About us', 'Our stories'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`text-base font-medium transition-colors duration-500 tracking-wide ${subTextClass}`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right Side Actions - Desktop */}
        <div className="hidden md:flex items-center">
          <Menubar className="border-none bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className={`text-base font-medium px-5 transition-colors duration-500 cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent ${contactBtnClass}`}>
                Contact us
              </MenubarTrigger>
              <MenubarContent className="bg-[#1a1a1a] border border-white/10 rounded-xl min-w-[280px]">
                <MenubarItem className="flex items-center gap-3 px-4 py-3 cursor-pointer focus:bg-white/10 focus:text-white">
                  <Phone size={18} className="text-white/70" />
                  <a href="tel:+918630302979" className="text-white">
                    +91 8630302979
                  </a>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-3 px-4 py-3 cursor-pointer focus:bg-white/10 focus:text-white">
                  <Mail size={18} className="text-white/70" />
                  <a href="mailto:protectthepeopleindia@gmail.com" className="text-white">
                    protectthepeopleindia@gmail.com
                  </a>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
          {/* Vertical Divider */}
          <div className={`h-14 w-px mx-1 transition-colors duration-500 ${dividerClass}`}></div>
          
          <Link 
            href="/contribution?tab=donate"
            className={`group flex items-center gap-2 text-base font-medium px-5 py-2 transition-colors duration-500 ${donateBtnClass}`}
          >
            <Heart size={20} className="transition-transform duration-300 group-hover:scale-110" />
            Donate
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className={`lg:hidden transition-colors p-1 ${textClass}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-3xl border-t border-white/10 p-8 flex flex-col gap-8 lg:hidden h-[calc(100vh-80px)] overflow-y-auto z-40">
          {[
            { label: 'How to help', href: '#how-to-help' },
            { label: 'About us', href: '#about-us' },
            { label: 'Our stories', href: '#our-stories' },
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-white text-4xl font-serif font-light hover:text-accent transition-colors tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="h-px w-full bg-white/10 my-4"></div>
          
          {/* Mobile Contact Info */}
          <div className="space-y-4">
            <p className="text-white/60 text-lg font-medium">Contact us</p>
            <a href="tel:+918630302979" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Phone size={20} />
              <span>+91 8630302979</span>
            </a>
            <a href="mailto:protectthepeopleindia@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
              <Mail size={20} />
              <span className="break-all">protectthepeopleindia@gmail.com</span>
            </a>
          </div>
          
          <Link href="/contribution?tab=donate" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-center border-white/30 text-white hover:bg-white hover:text-black mt-4 py-5 text-lg">
              <Heart size={20} className="mr-2" />
              Donate
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
