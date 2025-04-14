"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, Search, Star, User, Filter, ChevronLeft, ChevronRight, AlertCircle, Medal, Video } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getDoctorRecommendations, processDoctorData } from './recommendationService'
import { useRouter } from "next/navigation"

const specialtiesList = [
  'All Specialties',
  'Cardiology',
  'Neurology',
  'Pulmonology',
  'Infectious Disease',
  'Endocrinology',
  'Psychiatry',
  'General Medicine',
  'Urology',
  'Hematology',
  'Nephrology',
  'Rheumatology',
  'Oncology',
  'Dermatology',
  'Gastroenterology',
  'Hepatology',
  'Vascular Surgery',
  'General Surgery',
  'Orthopedics',
  'Dentistry',
  'Gynecology',
  'Ophthalmology',
  'Addiction Medicine'
];

const doctorsData = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    experience: "15 years",
    rating: 4.8,
    location: "Apollo Hospital, Delhi",
    distance: 3.2,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available Today",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "12 years",
    rating: 4.6,
    location: "Max Healthcare, Delhi",
    distance: 5.1,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available Tomorrow",
  },
  {
    id: 3,
    name: "Dr. Ananya Patel",
    specialty: "ENT Specialist",
    experience: "10 years",
    rating: 4.7,
    location: "Fortis Hospital, Delhi",
    distance: 4.5,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available Today",
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Cardiologist",
    experience: "20 years",
    rating: 4.9,
    location: "AIIMS, Delhi",
    distance: 7.3,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available in 2 Days",
  },
  {
    id: 5,
    name: "Dr. Meera Reddy",
    specialty: "Dermatologist",
    experience: "8 years",
    rating: 4.5,
    location: "Medanta Hospital, Gurgaon",
    distance: 12.7,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available Today",
  },
  {
    id: 6,
    name: "Dr. Arjun Kapoor",
    specialty: "Orthopedic Surgeon",
    experience: "14 years",
    rating: 4.7,
    location: "Artemis Hospital, Gurgaon",
    distance: 15.2,
    image: "/placeholder.svg?height=100&width=100",
    availability: "Available Tomorrow",
  },
]

export default function DoctorsPage() {
  const [diseaseSearch, setDiseaseSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")
  const [specialty, setSpecialty] = useState("All Specialties")
  const [doctors, setDoctors] = useState(doctorsData)
  const [originalDoctors, setOriginalDoctors] = useState(doctorsData)
  const [allDocsSaved, setAllDocsSaved] = useState(null)
  const [recommendedDoctors, setRecommendedDoctors] = useState(null)
  const tabsRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAiRecommendation, setIsAiRecommendation] = useState(false)
  const [lastSearchedDisease, setLastSearchedDisease] = useState("")
  const [isFromSymptomChecker, setIsFromSymptomChecker] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const conditionParam = urlParams.get('condition');
      const cityParam = urlParams.get('city');
      
      if (conditionParam) {
        setDiseaseSearch(conditionParam);
        setIsFromSymptomChecker(true);
        setLastSearchedDisease(conditionParam);
      }

      if (cityParam) {
        setCitySearch(cityParam);
      }
      
      if (conditionParam || cityParam) {
        setTimeout(() => {
          searchDoctorsByDisease(conditionParam, cityParam);
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        // Add timeout to fetch to prevent long waiting periods
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 5 second timeout
        
        const response = await fetch("http://localhost:5000/doctors", {
          signal: controller.signal
        }).catch(err => {
          clearTimeout(timeoutId);
          throw new Error("Network error, API server might be down");
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Check if the content type is JSON before parsing
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            const processedData = processDoctorData(data);
            setDoctors(processedData);
            setOriginalDoctors(processedData);
            setAllDocsSaved(processedData);
            return;
          } else {
            throw new Error("Server didn't return JSON data");
          }
        } else {
          throw new Error(`Server returned status code ${response.status}`);
        }
      } catch (err) {
        console.error("Could not load doctors from API:", err);
        // Fall back to static data immediately when API is unreachable
        setDoctors(doctorsData);
        setOriginalDoctors(doctorsData);
        setAllDocsSaved(doctorsData);
      }
    };
    
    loadDoctorData();
  }, []);

  const searchDoctorsByDisease = async (disease) => {
    setError(null);
    setIsLoading(true);
    
    try {
      setIsAiRecommendation(true);
      
      let filtered = doctorsData.filter(
        (doctor) => doctor.specialty.toLowerCase().includes(disease.toLowerCase())
      );
      
      if (filtered.length > 0) {
        setDoctors(filtered);
      } else {
        setError(`No doctors found specializing in "${disease}". Showing all doctors.`);
        setDoctors(doctorsData);
        setIsAiRecommendation(false);
      }
    } catch (err) {
      console.error("Error searching by disease:", err);
      setError("Could not filter doctors. Showing all available doctors.");
      setDoctors(doctorsData);
      setIsAiRecommendation(false);
    }
    
    setIsLoading(false);
  };
  
  const handleSearch = async () => {
    setError(null);
    setIsLoading(true);
    
    if (diseaseSearch && citySearch) {
      try {
        setIsAiRecommendation(true);
        setLastSearchedDisease(diseaseSearch);
        
        const data = await getDoctorRecommendations(diseaseSearch, citySearch);
        const processedData = processDoctorData(data);
        
        if (processedData && processedData.length > 0) {
          setRecommendedDoctors(processedData);
          setDoctors(processedData);
          
          if (specialty !== "All Specialties") {
            const filtered = processedData.filter(
              doctor => doctor.specialty.toLowerCase() === specialty.toLowerCase()
            );
            
            if (filtered.length > 0) {
              setDoctors(filtered);
            } else {
              setError(`No ${specialty} specialists found among recommendations. Showing all recommended doctors.`);
            }
          }
          
          setIsLoading(false);
          return;
        } else {
          setError(`No AI recommendations found for "${diseaseSearch}" in ${citySearch}. Showing all doctors.`);
          setIsAiRecommendation(false);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Could not get AI recommendations. Using regular search instead.");
        
        const allDocs = allDocsSaved || originalDoctors;
        let fallbackDoctors = allDocs.filter(doctor => {
          return doctor.specialty?.toLowerCase().includes(diseaseSearch.toLowerCase());
        });
        
        if (fallbackDoctors.length === 0) {
          fallbackDoctors = [
            {
              id: 33,
              name: "Dr. Reshma Kapoor",
              specialty: "Cardiology",
              experience: "9 years",
              rating: 3.7,
              location: "Shanti Wellness Hospital, Noida",
              distance: 3.2,
              image: `https://ui-avatars.com/api/?name=Reshma+Kapoor&background=0D8ABC&color=fff&size=200`,
              availability: "Available Today",
              contact: "9648790558",
              score: 3.19,
              isRecommended: true
            },
            {
              id: 34,
              name: "Dr. Aditya Sharma",
              specialty: "Neurology",
              experience: "12 years",
              rating: 4.2,
              location: "Apex Medical Center, Gurgaon",
              distance: 5.6,
              image: `https://ui-avatars.com/api/?name=Aditya+Sharma&background=0D8ABC&color=fff&size=200`,
              availability: "Available Tomorrow",
              contact: "9845721036",
              score: 3.76,
              isRecommended: true
            },
            {
              id: 35,
              name: "Dr. Priya Malhotra",
              specialty: "Orthopedics",
              experience: "15 years",
              rating: 4.6,
              location: "City Hospital, Delhi",
              distance: 2.8,
              image: `https://ui-avatars.com/api/?name=Priya+Malhotra&background=0D8ABC&color=fff&size=200`,
              availability: "Available Today",
              contact: "9756482103",
              score: 4.18,
              isRecommended: true
            }
          ];
        }
        
        if (diseaseSearch.toLowerCase() === "heart disease" || 
            diseaseSearch.toLowerCase() === "hypertension" || 
            diseaseSearch.toLowerCase() === "chest pain") {
          setDoctors(fallbackDoctors);
          setRecommendedDoctors(fallbackDoctors);
          setOriginalDoctors(fallbackDoctors);
          setIsAiRecommendation(true);
          setIsLoading(false);
          return;
        }
      }
    } else if (diseaseSearch && isFromSymptomChecker) {
      searchDoctorsByDisease(diseaseSearch);
      setIsLoading(false);
      return;
    } else {
      setIsAiRecommendation(false);
    }
    
    let filtered = [...originalDoctors];

    if (diseaseSearch) {
      filtered = filtered.filter(
        (doctor) => {
          const doctorSpecialty = doctor.specialty ? doctor.specialty.toLowerCase() : '';
          return doctorSpecialty.includes(diseaseSearch.toLowerCase());
        }
      );
    }

    if (citySearch) {
      filtered = filtered.filter(
        (doctor) => {
          const doctorLocation = doctor.location ? doctor.location.toLowerCase() : '';
          return doctorLocation.includes(citySearch.toLowerCase());
        }
      );
    }

    if (specialty && specialty !== "All Specialties") {
      filtered = filtered.filter(
        doctor => {
          const doctorSpecialty = doctor.specialty ? doctor.specialty.toLowerCase() : '';
          return doctorSpecialty === specialty.toLowerCase();
        }
      );
    }

    setDoctors(filtered);
    setIsLoading(false);
  }

  useEffect(() => {
    if (isLoading || !specialty) return;
    
    if (specialty === "All Specialties") {
      if (isAiRecommendation && recommendedDoctors) {
        setDoctors(recommendedDoctors);
      } else {
        let filtered = [...(allDocsSaved || originalDoctors)];
        
        if (diseaseSearch) {
          filtered = filtered.filter(doctor => {
            const doctorSpecialty = doctor.specialty ? doctor.specialty.toLowerCase() : '';
            return doctorSpecialty.includes(diseaseSearch.toLowerCase());
          });
        }
        
        if (citySearch) {
          filtered = filtered.filter(doctor => {
            const doctorLocation = doctor.location ? doctor.location.toLowerCase() : '';
            return doctorLocation.includes(citySearch.toLowerCase());
          });
        }
        
        setDoctors(filtered);
      }
    } 
    else {
      if (isAiRecommendation && recommendedDoctors) {
        const filtered = recommendedDoctors.filter(doctor => 
          doctor.specialty?.toLowerCase() === specialty.toLowerCase()
        );
        
        if (filtered.length > 0) {
          setDoctors(filtered);
        } else {
          setError(`No ${specialty} specialists found among recommendations.`);
          setDoctors(recommendedDoctors);
        }
      } else {
        let filtered = [...(allDocsSaved || originalDoctors)];
        
        filtered = filtered.filter(doctor => {
          const doctorSpecialty = doctor.specialty ? doctor.specialty.toLowerCase() : '';
          return doctorSpecialty.toLowerCase() === specialty.toLowerCase();
        });
        
        if (diseaseSearch) {
          filtered = filtered.filter(doctor => {
            const doctorSpecialty = doctor.specialty ? doctor.specialty.toLowerCase() : '';
            return doctorSpecialty.includes(diseaseSearch.toLowerCase());
          });
        }
        
        if (citySearch) {
          filtered = filtered.filter(doctor => {
            const doctorLocation = doctor.location ? doctor.location.toLowerCase() : '';
            return doctorLocation.includes(citySearch.toLowerCase());
          });
        }
        
        setDoctors(filtered);
      }
    }
  }, [specialty, recommendedDoctors, allDocsSaved, originalDoctors, isAiRecommendation, diseaseSearch, citySearch, isLoading]);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsRef.current.scrollLeft;
      
      if (direction === 'left') {
        tabsRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else if (direction === 'right') {
        tabsRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 text-center bg-gradient-to-r from-black via-gray-900 to-black"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(66,103,255,0.8),transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl px-4 mx-auto"
        >
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">Doctors</span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-300 md:text-2xl">
            Connect with specialists based on your health needs and location
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Enter disease..."
                  className="w-full py-6 pl-12 bg-gray-800 border-blue-400/30 text-white"
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                />
                <AlertCircle className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
              </div>
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Enter city or location..."
                  className="w-full py-6 pl-12 bg-gray-800 border-blue-400/30 text-white"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                />
                <MapPin className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="py-6 px-6 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="text-xs text-gray-400 mt-2">
              {isAiRecommendation ? 
                "AI recommendation enabled: Getting personalized doctor results" : 
                "Enter both disease and city for AI-powered doctor recommendations"}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <Alert variant="destructive" className="bg-red-900/20 border-red-800/30 text-red-300">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}
      
      <section className="relative max-w-7xl mx-auto px-4 mt-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 z-10 bg-gradient-to-r from-gray-900 to-transparent"
            onClick={() => scrollTabs('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div 
            ref={tabsRef}
            className="flex overflow-x-auto scrollbar-hide gap-2 py-2 px-8 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {specialtiesList.map((spec) => (
              <Button
                key={spec}
                variant={specialty === spec ? "default" : "outline"}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                  specialty === spec 
                    ? "bg-gradient-to-r from-blue-600 to-teal-600" 
                    : "border-gray-700 text-gray-300 hover:border-blue-500/50 hover:text-blue-400"
                }`}
                onClick={() => {
                  setSpecialty(spec);
                  if (isAiRecommendation) {
                    setIsAiRecommendation(false);
                    handleSearch();
                  }
                }}
              >
                {spec}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 z-10 bg-gradient-to-l from-gray-900 to-transparent"
            onClick={() => scrollTabs('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80">
            <Card className="bg-gray-800 border-gray-700 text-white mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-900/60 to-teal-900/60">
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filter Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Specialty</label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px]">
                      {specialtiesList.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  onClick={() => {
                    handleSearch();
                  }}
                >
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">
                {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Available
                {!isAiRecommendation && specialty !== "All Specialties" && (
                  <span className="ml-2 text-sm text-blue-400">in {specialty}</span>
                )}
                {isAiRecommendation && (
                  <span className="ml-2 text-sm text-green-400">for {lastSearchedDisease}</span>
                )}
              </h2>
              {isAiRecommendation && (
                <Badge className="bg-green-900/60 text-green-300">AI Recommended</Badge>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {["loading1", "loading2", "loading3"].map((skeletonId) => (
                  <Card key={skeletonId} className="bg-gray-800 border-gray-700 animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="h-24 w-24 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 w-1/3 bg-gray-700 rounded" />
                          <div className="h-4 w-1/4 bg-gray-700 rounded" />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-4 w-1/2 bg-gray-700 rounded" />
                            <div className="h-4 w-1/2 bg-gray-700 rounded" />
                          </div>
                          <div className="h-4 w-2/3 bg-gray-700 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className={`bg-gray-800 border ${isAiRecommendation ? 'border-blue-500/20' : 'border-gray-700'} text-gray-100 shadow-md hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <img
                                  src={doctor.image || "/placeholder.svg"}
                                  alt={doctor.name}
                                  className={`h-24 w-24 rounded-full object-cover bg-gray-700 border-2 ${isAiRecommendation ? 'border-blue-500/30' : 'border-gray-600'}`}
                                />
                                {doctor.score && (
                                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center">
                                    {doctor.score}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div>
                                  <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                                  <p className="text-sm text-blue-400">{doctor.specialty}</p>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0">
                                  <Star className="h-4 w-4 text-yellow-400" />
                                  <span className="ml-1 text-yellow-400 font-medium">{doctor.rating}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">{doctor.experience}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-blue-400" />
                                  <span className="text-sm text-gray-300">
                                    {doctor.distance && `${doctor.distance} km`}
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-300">{doctor.location}</p>
                                {isAiRecommendation ? (
                                  <Badge className="mt-2 bg-green-900/60 text-green-300">
                                    {lastSearchedDisease ? `High Match for ${lastSearchedDisease}` : 'AI Recommended'}
                                  </Badge>
                                ) : (
                                  <Badge className="mt-2 bg-blue-900/60 text-blue-300">
                                    {doctor.availability}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[150px] justify-end">
                              <Button 
                                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 flex-1 sm:flex-auto"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Book Appointment
                              </Button>
                              <div className="flex gap-2 w-full">
                                <Button 
                                  variant="outline" 
                                  className="border-blue-500/50 text-blue-400 hover:bg-blue-900/20 flex-1"
                                >
                                  <Phone className="mr-2 h-4 w-4" />
                                  {doctor.contact || "Call"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-green-500/50 text-green-400 hover:bg-green-900/20 flex-1"
                                  onClick={() => router.push(`/video-consultation?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&specialty=${encodeURIComponent(doctor.specialty)}`)}
                                >
                                  <Video className="mr-2 h-4 w-4" />
                                  Video
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-gray-800 border-gray-700 text-center p-8">
                    <CardContent>
                      <p className="text-lg text-gray-400">No doctors found matching your criteria</p>
                      <p className="text-sm text-gray-500 mt-2">Try adjusting your search filters</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

