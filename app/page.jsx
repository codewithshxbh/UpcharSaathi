'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Lightbulb } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center justify-center flex-1 px-4 py-16 text-center bg-gradient-to-r from-black via-gray-900 to-black"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(66,103,255,0.8),transparent_70%)]" />
        
        <motion.div 
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">UpcharSaathi</span>
          </h1>
          
          <motion.p 
            variants={fadeIn}
            className="mb-8 text-xl text-gray-300 md:text-2xl"
          >
            Your trusted healthcare companion for first aid guidance, symptom checking, and connecting with qualified doctors.
          </motion.p>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div variants={fadeIn}>
              <Button 
                onClick={() => router.push('/symptom-checker')} 
                className="px-8 py-6 text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Check Symptoms
              </Button>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Button 
                onClick={() => router.push('/first-aid')} 
                variant="outline"
                className="px-8 py-6 text-lg transition-all duration-300 border-blue-400 text-blue-400 hover:bg-blue-900/20 hover:shadow-lg hover:shadow-blue-500/20"
              >
                First Aid Guide
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Blur Cards Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative px-4 py-16 bg-gradient-to-b from-black to-gray-900"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(66,103,255,0.15),transparent_70%)]" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-3xl font-bold text-center text-white"
          >
            Health Insights
          </motion.h2>
          
          <div className="grid gap-8 md:grid-cols-4">
            {/* Search History Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full overflow-hidden bg-gray-800 border border-gray-700 text-gray-100 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-lg border-[1px] border-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Search History</span>
                    {isAuthenticated ? null : <Badge variant="outline" className="text-xs bg-yellow-600/40 text-yellow-200">Login Required</Badge>}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Your recent health searches
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {isAuthenticated ? (
                    <ul className="space-y-3">
                      {[
                        { query: "Headache remedies", date: "2 days ago" },
                        { query: "Allergy symptoms", date: "5 days ago" },
                        { query: "Back pain causes", date: "1 week ago" },
                      ].map((item, index) => (
                        <li key={index} className="flex justify-between p-2 transition-colors rounded-md hover:bg-gray-700/50">
                          <span>{item.query}</span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="mb-4 text-gray-300">Sign in to view your search history</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/auth/login')}
                        className="border-blue-400 text-blue-400 hover:bg-blue-900/20"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-700 bg-gray-800/50">
                  <Button variant="link" size="sm" className="text-blue-400 hover:text-blue-300">
                    View full history
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Medicines Card - NEW */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full overflow-hidden bg-gray-800 border border-gray-700 text-gray-100 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-lg border-[1px] border-blue-500">
                <CardHeader className="bg-gradient-to-r from-teal-900/60 to-blue-900/60 pb-2">
                  <CardTitle className="flex items-center">
                    <span>Medicines</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Order medicines for home delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {[
                      { name: "Prescription Drugs", delivery: "Same day available" },
                      { name: "OTC Medications", delivery: "Express delivery" },
                      { name: "Healthcare Products", delivery: "Standard delivery" },
                    ].map((item, index) => (
                      <li key={index} className="flex justify-between p-2 transition-colors rounded-md hover:bg-gray-700/50">
                        <span>{item.name}</span>
                        <span className="text-xs text-teal-400">{item.delivery}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-gray-700 bg-gray-800/50">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => router.push('/medicines')}
                  >
                    Browse medicines
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Trending Diseases Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full overflow-hidden bg-gray-800 border border-gray-700 text-gray-100 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-lg border-[1px] border-blue-500">
                <CardHeader className="bg-gradient-to-r from-purple-900/60 to-red-900/60 pb-2">
                  <CardTitle className="flex items-center">
                    <span>Trending Health Concerns</span>
                    <TrendingUp className="w-5 h-5 ml-2 text-red-400" />
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Global health trends and outbreaks
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {[
                      { name: "Seasonal Influenza", region: "Global", trend: "rising" },
                      { name: "COVID-19 Variants", region: "Multiple Regions", trend: "stable" },
                      { name: "Dengue Fever", region: "South Asia", trend: "rising" },
                      { name: "Measles Outbreaks", region: "Central Africa", trend: "rising" }
                    ].map((disease, index) => (
                      <li key={index} className="flex items-center justify-between p-2 transition-colors rounded-md hover:bg-gray-700/50">
                        <div>
                          <p className="font-medium">{disease.name}</p>
                          <p className="text-xs text-gray-400">{disease.region}</p>
                        </div>
                        <Badge 
                          variant={disease.trend === "rising" ? "destructive" : "outline"} 
                          className={`${disease.trend === "rising" ? "bg-red-900/60 hover:bg-red-800/60" : "bg-blue-900/60 hover:bg-blue-800/60"}`}
                        >
                          {disease.trend === "rising" ? "↑" : "→"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="border-t border-gray-700 bg-gray-800/50">
                  <Button variant="link" size="sm" className="text-blue-400 hover:text-blue-300">
                    View all trends
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Health Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full overflow-hidden bg-gray-800 border border-gray-700 text-gray-100 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-lg border-[1px] border-blue-500">
                <CardHeader className="bg-gradient-to-r from-green-900/60 to-blue-900/60 pb-2">
                  <CardTitle className="flex items-center">
                    <span>Daily Health Tips</span>
                    <Lightbulb className="w-5 h-5 ml-2 text-yellow-400" />
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Improve your wellness with these tips
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-3 transition-colors rounded-md hover:bg-gray-700/50">
                      <h4 className="mb-1 font-medium text-blue-300">Hydration Reminder</h4>
                      <p className="text-sm text-gray-300">Drink at least 8 glasses of water daily to maintain proper hydration and support organ function.</p>
                    </div>
                    <div className="p-3 transition-colors rounded-md hover:bg-gray-700/50">
                      <h4 className="mb-1 font-medium text-green-300">Movement Break</h4>
                      <p className="text-sm text-gray-300">Take a 5-minute walk for every hour spent sitting to reduce risks associated with sedentary lifestyle.</p>
                    </div>
                    <div className="p-3 transition-colors rounded-md hover:bg-gray-700/50">
                      <h4 className="mb-1 font-medium text-purple-300">Mental Wellness</h4>
                      <p className="text-sm text-gray-300">Practice 10 minutes of mindfulness meditation daily to reduce stress and improve focus.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-700 bg-gray-800/50">
                  <Button variant="link" size="sm" className="text-blue-400 hover:text-blue-300">
                    More health tips
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-4 py-16 bg-gray-900"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-3xl font-bold text-center text-white"
          >
            Our Features
          </motion.h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 transition-all duration-300 border border-gray-700 rounded-lg shadow-xl bg-gray-800/50 hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-white">First Aid Guides</h3>
              <p className="text-gray-300">Access detailed first aid instructions for various emergency situations.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 transition-all duration-300 border border-gray-700 rounded-lg shadow-xl bg-gray-800/50 hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-white">Symptom Checker</h3>
              <p className="text-gray-300">Analyze your symptoms and get insights about possible conditions.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 transition-all duration-300 border border-gray-700 rounded-lg shadow-xl bg-gray-800/50 hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-white">Doctor Connection</h3>
              <p className="text-gray-300">Find and connect with qualified healthcare professionals.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-4 py-16 bg-gradient-to-r from-blue-900 to-purple-900"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl font-bold text-white"
          >
            Ready to take control of your health?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 text-xl text-blue-100"
          >
            Create an account to save your health data and get personalized recommendations.
          </motion.p>
          
          {!isAuthenticated ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/auth/signup">
                <Button className="px-8 py-3 text-lg transition-all duration-300 bg-white hover:bg-gray-100 text-blue-900 hover:shadow-lg hover:shadow-white/30">
                  Sign Up
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="px-8 py-3 text-lg transition-all duration-300 border-white text-white hover:bg-white/10 hover:shadow-lg hover:shadow-white/20">
                  Log In
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                onClick={() => router.push('/symptom-checker')} 
                className="px-8 py-3 text-lg transition-all duration:300 bg-white hover:bg-gray-100 text-blue-900 hover:shadow-lg hover:shadow-white/30"
              >
                Start Using Now
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}

