import React from 'react';

export const metadata = {
  title: 'Contact Us - UpcharSaathi',
  description: 'Get in touch with UpcharSaathi - We\'re here to help',
}

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-white to-blue-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            Contact Us
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-4 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-xl 
            border border-gray-700 hover:border-teal-500/50 transition-all duration-300 
            hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
              Get in Touch
            </h2>
            <form className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white
                    focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    hover:border-teal-500/50 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white
                    focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    hover:border-teal-500/50 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors">Message</label>
                <textarea 
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white
                    focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32
                    hover:border-teal-500/50 transition-all duration-300"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg 
                font-medium hover:from-teal-600 hover:to-blue-600 transition-all duration-300
                hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-xl 
            border border-gray-700 hover:border-teal-500/50 transition-all duration-300 
            hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
              Contact Information
            </h2>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="flex items-center">
                  support@upcharsaathi.com
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="flex items-center">
                  +1 234 567 890
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Address</h3>
                <p className="flex items-center">
                  1234 Healthcare St,<br />
                  Wellness City, HW 56789
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}