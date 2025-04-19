'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Phone, Search, Star, User, Medal, AlertCircle, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  getDoctorRecommendations, 
  processDoctorData, 
  getAllSpecializations, 
  searchDoctorsBySpecialization 
} from './recommendationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DoctorRecommendation() {
  const [disease, setDisease] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [searchMethod, setSearchMethod] = useState('disease');
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [cities, setCities] = useState([
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Noida', 
    'Kochi', 'Guwahati', 'Bhopal', 'Chandigarh', 'Ahmedabad'
  ]);
  
  // Fetch all available specializations when component mounts
  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoadingSpecializations(true);
      try {
        const specs = await getAllSpecializations();
        setSpecializations(specs);
      } catch (err) {
        console.error("Failed to fetch specializations:", err);
        // Fallback to some common specializations
        setSpecializations([
          'Cardiology', 'Neurology', 'Ophthalmology', 'Dermatology',
          'Orthopedics', 'Pediatrics', 'Gynecology', 'Pulmonology',
          'Gastroenterology', 'Nephrology', 'Oncology', 'Psychiatry'
        ]);
      } finally {
        setLoadingSpecializations(false);
      }
    };
    
    fetchSpecializations();
  }, []);

  // Fetch doctor recommendations when the component mounts
  useEffect(() => {
    handleRecommendationSearch();
  }, []);

  // Function to handle recommendation search
  const handleRecommendationSearch = async () => {
    // Validation based on search method
    if (searchMethod === 'disease' && !disease) {
      setError('Please enter a disease to get doctor recommendations');
      return;
    }
    
    if (searchMethod === 'specialization' && !specialization) {
      setError('Please select a specialization to get doctor recommendations');
      return;
    }
    
    if (!city) {
      setError('Please enter a city to get doctor recommendations');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setApiError(false);
    
    try {
      // Call the API based on search method
      let data;
      try {
        if (searchMethod === 'disease') {
          data = await getDoctorRecommendations(disease, city);
        } else {
          data = await searchDoctorsBySpecialization(specialization, city);
        }
        data = processDoctorData(data);
      } catch (err) {
        // If API call fails, show error and fallback to mock data for demo
        console.error('API Error:', err);
        setApiError(true);
        throw err;
      }
      
      setRecommendedDoctors(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Failed to get doctor recommendations. Please try again.');
      
      // For demo: show some results even if the API fails
      if (apiError) {
        // Mock data as fallback
        const fallbackDoctors = [
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
            score: 3.19
          }
        ];
        setRecommendedDoctors(fallbackDoctors);
        setShowResults(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 shadow-lg shadow-blue-500/10"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Find Doctor by Health Concern</h2>
          <p className="text-gray-300 mt-2">
            Our AI-powered recommendation system will suggest the best doctors for your specific health needs
          </p>
        </div>
        
        <Tabs defaultValue="disease" className="w-full mb-6" onValueChange={value => setSearchMethod(value)}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-700/60">
            <TabsTrigger value="disease">Search by Health Condition</TabsTrigger>
            <TabsTrigger value="specialization">Search by Specialization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="disease" className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="disease" className="block text-sm font-medium text-gray-300 mb-2">
                  Health Condition or Disease
                </label>
                <div className="relative">
                  <Input
                    id="disease"
                    placeholder="e.g. Diabetes, Hypertension, Depression"
                    className="pl-10 bg-gray-700/60 border-gray-600 text-white"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                  />
                  <AlertCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specialization" className="mt-4">
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2">
                Medical Specialization
              </label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                  <SelectValue placeholder="Select a specialization" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {loadingSpecializations ? (
                    <SelectItem value="loading" disabled>Loading specializations...</SelectItem>
                  ) : (
                    specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-6">
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
            Your City
          </label>
          <div className="relative">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white pl-10">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="">Type your city...</SelectItem>
                {cities.map(cityName => (
                  <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Allow typing a custom city if not in the list */}
          {!cities.includes(city) && (
            <Input
              placeholder="Or type your city here"
              className="mt-2 bg-gray-700/60 border-gray-600 text-white"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800/30 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {apiError && (
                <div className="mt-2 text-sm">
                  Make sure the Flask API is running by double-clicking the run_api.bat file in the "recommendation system" folder.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleRecommendationSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-6 font-medium text-lg"
        >
          {isLoading ? 'Finding Best Doctors...' : 'Get Doctor Recommendations'}
        </Button>
        
        {showResults && recommendedDoctors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                {searchMethod === 'disease' 
                  ? `Top Recommended Doctors for ${disease} in ${city}`
                  : `Top ${specialization} Specialists in ${city}`}
              </h3>
              <Badge className="bg-blue-800">{recommendedDoctors.length} doctors found</Badge>
            </div>
            
            <div className="space-y-4">
              {recommendedDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="bg-gray-800 border border-blue-500/20 text-gray-100 shadow-md hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-teal-500"></div>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full overflow-hidden relative bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-blue-500/30">
                              {doctor.image ? (
                                <img
                                  src={doctor.image}
                                  alt={doctor.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff`;
                                  }}
                                />
                              ) : (
                                <img
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff`}
                                  alt={doctor.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center">
                              {doctor.score}
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
                              <Medal className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-gray-300">
                                AI Recommended
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-300">{doctor.location}</p>
                            <Badge className="mt-2 bg-green-900/60 text-green-300">
                              {searchMethod === 'disease' 
                                ? `High Match for ${disease}`
                                : `${doctor.specialty} Specialist`}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[150px] justify-end">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 flex-1 sm:flex-auto"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book Appointment
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-900/20 flex-1 sm:flex-auto"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            {doctor.contact}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {showResults && recommendedDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center py-8"
          >
            <div className="bg-gray-800/70 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">No Doctors Found</h3>
              <p className="text-gray-400">
                {searchMethod === 'disease' 
                  ? `We couldn't find doctors specializing in ${disease} in ${city}.`
                  : `We couldn't find ${specialization} specialists in ${city}.`}
                <br />
                Please try a different {searchMethod === 'disease' ? 'condition' : 'specialization'} or location.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}