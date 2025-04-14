'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";

export default function HelpButton() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('footer');
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] transition-opacity duration-300 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
      <Link href="/contact-us">
        <Button
          variant="ghost"
          className="text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all
            shadow-[0_0_25px_rgba(66,153,225,0.5)] hover:shadow-[0_0_30px_rgba(66,153,225,0.6)]
            border border-blue-500/30 hover:border-blue-400/50 rounded-xl px-10 py-6 flex items-center gap-3"
        >
          <Pill className="h-6 w-6 text-blue-200" />
          <div className="flex flex-col items-start">
            <span className="text-base font-semibold mb-1">Medical Assistance?</span>
            <span className="text-xs text-blue-200">Get expert healthcare support now</span>
          </div>
        </Button>
      </Link>
    </div>
  );
}
