export const metadata = {
  title: 'About Us - UpcharSaathi',
  description: 'Learn about UpcharSaathi - Your AI-powered healthcare companion',
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-white to-blue-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            About Us
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {[
            {
              title: "Our Mission",
              content: "UpcharSaathi is an AI-powered symptom checker and doctor recommendation system. Our mission is to provide accessible and reliable healthcare information to everyone."
            },
            {
              title: "Our Team",
              content: "Our team consists of experienced healthcare professionals and technology experts who are dedicated to improving healthcare accessibility."
            },
            {
              title: "Our Commitment",
              content: "At UpcharSaathi, we are committed to maintaining the highest standards of accuracy and privacy. Your health information is secure with us."
            },
            {
              title: "Technology",
              content: "We use advanced AI algorithms to analyze symptoms and provide personalized recommendations, ensuring you get the most accurate information."
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-xl 
                border border-gray-700 hover:border-teal-500/50 transition-all duration-300 
                hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text group-hover:scale-105 transition-transform duration-300">
                {item.title}
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}