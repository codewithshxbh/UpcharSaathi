import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-gray-800 backdrop-blur-sm py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h4 className="text-lg font-bold mb-2 hover:text-teal-400 transition-colors duration-300">UpcharSaathi</h4>
            <p className="text-sm">&copy; 2023 UpcharSaathi. All rights reserved.</p>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-bold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact-us" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about-us" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-bold mb-2">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/symptom-checker" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                >
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link 
                  href="/doctors" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link 
                  href="/first-aid" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                >
                  First Aid
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-white">
            <h4 className="text-lg font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                { label: 'Twitter', href: '#' },
                { label: 'Facebook', href: '#' },
                { label: 'Instagram', href: '#' }
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

