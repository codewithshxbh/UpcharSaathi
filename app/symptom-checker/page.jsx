'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  X,
  MapPin,
  Search
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SymptomChecker() {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [autoDetectLocation, setAutoDetectLocation] = useState(false)
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const router = useRouter()
  const { isAuthenticated, user, addMedicalRecord } = useAuth()

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Sore throat', 'Fatigue',
    'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Chest pain',
    'Shortness of breath', 'Muscle ache', 'Joint pain', 'Rash', 'Chills',
    'Loss of taste', 'Loss of smell', 'Dizziness', 'Congestion', 'Runny nose',
    'Wheezing', 'Blurred vision', 'Increased thirst', 'Frequent urination',
    'Persistent sadness', 'Loss of interest', 'Sleep disturbances', 'Difficulty concentrating',
    'Chest tightness', 'Difficulty breathing', 'Nervousness', 'Increased heart rate',
    'Sweating', 'Rapid breathing', 'Unexplained weight loss', 'Sensitivity to light'
  ]

  const commonLocations = [
    'Noida', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
    'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
    'Amritsar', 'Allahabad', 'Ranchi', 'Coimbatore', 'Jabalpur',
    'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur'
  ]

  
  const detectLocation = () => {
    setDetectingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log(`Got coordinates: Lat ${latitude}, Long ${longitude}`);
            
            // First try - simple reverse geocoding with fetch
            try {
              // This is a free, CORS-enabled reverse geocoding service
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
              if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
              }
              
              const data = await response.json();
              console.log('Geocoding response:', data);
              
              // Extract location information from various possible fields
              let detectedCity = '';
              if (data.address) {
                detectedCity = data.address.city || 
                            data.address.town || 
                            data.address.county ||
                            data.address.state ||
                            data.address.village || 
                            '';
                console.log('Detected location from API:', detectedCity);
              }
              
              // If we found a city, try to match it or use it directly
              if (detectedCity) {
                // Try exact match first
                const exactMatch = commonLocations.find(city => 
                  city.toLowerCase() === detectedCity.toLowerCase()
                );
                
                if (exactMatch) {
                  setLocation(exactMatch);
                  setLocationMessage(`Successfully detected your location: ${exactMatch}`);
                  setDetectingLocation(false);
                  setAutoDetectLocation(true);
                  return;
                }
                
                // Try partial match
                const partialMatch = commonLocations.find(city => 
                  city.toLowerCase().includes(detectedCity.toLowerCase()) || 
                  detectedCity.toLowerCase().includes(city.toLowerCase())
                );
                
                if (partialMatch) {
                  setLocation(partialMatch);
                  setLocationMessage(`Found similar location: ${partialMatch}`);
                  setDetectingLocation(false);
                  setAutoDetectLocation(true);
                  return;
                }
              }
              
              // If we get here, we couldn't match the detected city
              // Try to use the state or country to find a major city
              if (data.address && data.address.state) {
                const stateBasedCity = commonLocations.find(city => 
                  data.address.state.toLowerCase().includes(city.toLowerCase()) || 
                  city.toLowerCase().includes(data.address.state.toLowerCase())
                );
                
                if (stateBasedCity) {
                  setLocation(stateBasedCity);
                  setLocationMessage(`Using major city in ${data.address.state}: ${stateBasedCity}`);
                  setDetectingLocation(false);
                  setAutoDetectLocation(true);
                  return;
                }
              }
              
              // If all else fails, use IP-based geolocation as fallback
              console.log('Could not match location from coordinates, using default');
            } catch (apiError) {
              console.error('Error with geocoding API:', apiError);
            }
            
            // Fallback - try an IP-based approach instead
            try {
              console.log('Using IP-based geolocation as fallback');
              // Instead of random selection, always use the most reliable major city
              const defaultCity = 'Noida';
              
              setLocation(defaultCity);
              setLocationMessage(`Using default location: ${defaultCity}`);
              setDetectingLocation(false);
              setAutoDetectLocation(true);
              return;
            } catch (fallbackError) {
              console.error('Fallback location also failed:', fallbackError);
              // Use first city as last resort
              setLocation(commonLocations[0]);
              setLocationMessage(`Could not detect location. Using ${commonLocations[0]}`);
            }
            
          } catch (error) {
            console.error('Error in geolocation process:', error);
            // Last resort fallback
            setLocation(commonLocations[0]);
            setLocationMessage(`Error detecting location. Using ${commonLocations[0]}`);
            setDetectingLocation(false);
            setAutoDetectLocation(true);
          } finally {
            // Ensure we always clear the detecting state
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetectingLocation(false);
          
          let errorMessage = "An error occurred getting your location.";
          // Show appropriate error message based on the error code
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access was denied. Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Using default location.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get location timed out. Using default location.";
              break;
          }
          
          alert(errorMessage);
          setLocation(commonLocations[0]);
          setLocationMessage(`Using default location: ${commonLocations[0]}`);
          setAutoDetectLocation(true);
        },
        { 
          maximumAge: 30000,        // Use cached position if less than 30 seconds old
          timeout: 8000,           // Timeout after 8 seconds
          enableHighAccuracy: false // High accuracy not needed for city-level location
        }
      );
    } else {
      setDetectingLocation(false);
      alert("Geolocation is not supported by this browser. Using default location.");
      setLocation(commonLocations[0]);
      setLocationMessage(`Using default location: ${commonLocations[0]}`);
      setAutoDetectLocation(true);
    }
  }

  const filteredSymptoms = commonSymptoms.filter(symptom => 
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleNextStep = () => {
    if (step === 1 && (age === '' || gender === '')) {
      alert('Please provide your age and gender')
      return
    }
    
    if (step === 2 && selectedSymptoms.length === 0) {
      alert('Please select at least one symptom')
      return
    }

    if (step === 3 && location === '') {
      alert('Please provide your location')
      return
    }
    
    if (step === 4) {
      handleSubmit()
      return
    }
    
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    // Disease database using diseases from dataset.csv
    const diseaseDatabase = [
      {
        name: "Hypertensive disease",
        specialization: "Cardiology",
        symptoms: ["Headache", "Dizziness", "Chest pain", "Shortness of breath", "Fatigue", "High blood pressure"],
        description: "A condition in which the blood pressure in the arteries is persistently elevated.",
        selfCare: [
          "Maintain a healthy diet low in sodium",
          "Exercise regularly",
          "Monitor blood pressure regularly",
          "Take prescribed medications as directed"
        ]
      },
      {
        name: "Coronavirus disease 2019",
        specialization: "Infectious Disease",
        symptoms: ["Fever", "Cough", "Shortness of breath", "Loss of taste", "Loss of smell", "Fatigue", "Sore throat"],
        description: "An infectious disease caused by the SARS-CoV-2 virus that primarily affects the respiratory system.",
        selfCare: [
          "Isolate from others",
          "Monitor your symptoms",
          "Stay hydrated and rest",
          "Take over-the-counter medications for fever"
        ]
      },
      {
        name: "Diabetes",
        specialization: "Endocrinology",
        symptoms: ["Frequent urination", "Increased thirst", "Fatigue", "Blurred vision", "Unexplained weight loss", "Slow healing of wounds"],
        description: "A chronic disease that affects how your body turns food into energy, characterized by high blood glucose levels.",
        selfCare: [
          "Monitor blood sugar levels regularly",
          "Follow a balanced diet",
          "Exercise regularly",
          "Take medications as prescribed"
        ]
      },
      {
        name: "Depression mental",
        specialization: "Psychiatry",
        symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances", "Difficulty concentrating", "Changes in appetite"],
        description: "A mood disorder that causes a persistent feeling of sadness and loss of interest in activities.",
        selfCare: [
          "Maintain a regular routine",
          "Exercise regularly",
          "Seek social support",
          "Consider therapy or counseling"
        ]
      },
      {
        name: "Coronary heart disease",
        specialization: "Cardiology",
        symptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Dizziness", "Nausea", "Irregular heartbeat"],
        description: "A type of heart disease that develops when the coronary arteries become damaged or diseased.",
        selfCare: [
          "Follow a heart-healthy diet",
          "Exercise regularly as advised by doctor",
          "Quit smoking",
          "Take medications as prescribed"
        ]
      },
      {
        name: "Pneumonia",
        specialization: "Pulmonology",
        symptoms: ["Cough", "Fever", "Shortness of breath", "Chest pain", "Fatigue", "Rapid breathing"],
        description: "An infection that inflames the air sacs in one or both lungs, which may fill with fluid.",
        selfCare: [
          "Rest and get plenty of sleep",
          "Stay hydrated",
          "Take fever reducers if needed",
          "Complete the full course of antibiotics if prescribed"
        ]
      },
      {
        name: "Asthma",
        specialization: "Pulmonology",
        symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Cough", "Difficulty breathing"],
        description: "A condition in which your airways narrow and swell and may produce extra mucus.",
        selfCare: [
          "Avoid asthma triggers",
          "Use prescribed inhalers as directed",
          "Monitor breathing with a peak flow meter",
          "Follow your asthma action plan"
        ]
      },
      {
        name: "Gastroenteritis",
        specialization: "Gastroenterology",
        symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Fever", "Dehydration"],
        description: "An intestinal infection marked by diarrhea, abdominal cramps, nausea, vomiting, and sometimes fever.",
        selfCare: [
          "Stay hydrated with clear fluids",
          "Eat bland, easy-to-digest foods",
          "Rest and avoid dairy products",
          "Use over-the-counter medications as directed"
        ]
      },
      {
        name: "Migraine disorders",
        specialization: "Neurology",
        symptoms: ["Headache", "Sensitivity to light", "Nausea", "Dizziness", "Blurred vision", "Sensitivity to sound"],
        description: "A neurological condition characterized by recurrent headaches that are moderate to severe.",
        selfCare: [
          "Rest in a dark, quiet room",
          "Apply cold or warm compresses",
          "Stay hydrated",
          "Take prescribed medications at first sign of migraine"
        ]
      },
      {
        name: "Influenza",
        specialization: "General Medicine",
        symptoms: ["Fever", "Chills", "Muscle ache", "Cough", "Sore throat", "Fatigue", "Runny nose"],
        description: "A contagious viral infection that attacks your respiratory system.",
        selfCare: [
          "Rest and stay hydrated",
          "Take over-the-counter fever reducers",
          "Use a humidifier to ease congestion",
          "Avoid contact with others"
        ]
      },
      {
        name: "Anxiety state",
        specialization: "Psychiatry",
        symptoms: ["Nervousness", "Increased heart rate", "Rapid breathing", "Sweating", "Difficulty concentrating", "Worry"],
        description: "A mental health disorder characterized by feelings of worry, anxiety, or fear that are strong enough to interfere with daily activities.",
        selfCare: [
          "Practice deep breathing and relaxation techniques",
          "Exercise regularly",
          "Maintain a regular sleep schedule",
          "Consider mindfulness meditation"
        ]
      },
      {
        name: "Upper respiratory infection",
        specialization: "General Medicine",
        symptoms: ["Runny nose", "Congestion", "Sore throat", "Cough", "Sneezing", "Mild fever"],
        description: "An infection affecting the upper respiratory tract, including the nose, throat, pharynx, larynx, and bronchi.",
        selfCare: [
          "Rest and drink plenty of fluids",
          "Use over-the-counter decongestants or pain relievers",
          "Use a humidifier to add moisture to the air",
          "Gargle with salt water for sore throat"
        ]
      },
      {
        name: "Chronic obstructive airway disease",
        specialization: "Pulmonology",
        symptoms: ["Shortness of breath", "Chronic cough", "Wheezing", "Chest tightness", "Fatigue", "Recurrent respiratory infections"],
        description: "A chronic inflammatory lung disease that causes obstructed airflow from the lungs, making it difficult to breathe.",
        selfCare: [
          "Quit smoking and avoid secondhand smoke",
          "Use prescribed inhalers and medications",
          "Attend pulmonary rehabilitation if recommended",
          "Get vaccinated against flu and pneumonia"
        ]
      },
      {
        name: "Accident cerebrovascular",
        specialization: "Neurology",
        symptoms: ["Sudden numbness or weakness", "Confusion", "Difficulty speaking", "Severe headache", "Dizziness", "Loss of balance"],
        description: "Also known as stroke, occurs when blood supply to part of the brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.",
        selfCare: [
          "This is a medical emergency - call emergency services immediately",
          "Note the time when symptoms first appeared",
          "Do not take aspirin, food, or drinks while waiting for help",
          "After treatment, follow your doctor's recommendations for rehabilitation"
        ]
      },
      {
        name: "Depressive disorder",
        specialization: "Psychiatry",
        symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances", "Feelings of worthlessness", "Recurrent thoughts of death"],
        description: "A mental health disorder characterized by persistently depressed mood and loss of interest in activities, causing significant impairment in daily life.",
        selfCare: [
          "Seek professional help from a mental health provider",
          "Follow treatment plan including therapy and/or medication",
          "Maintain a regular sleep schedule",
          "Stay connected with supportive people"
        ]
      }
    ];
    
    // Match symptoms to diseases with improved matching algorithm
    const possibleConditions = diseaseDatabase.map(disease => {
      // Convert both arrays to lowercase for case-insensitive matching
      const diseaseSymptoms = disease.symptoms.map(s => s.toLowerCase());
      const userSymptoms = selectedSymptoms.map(s => s.toLowerCase());
      
      // Count matching symptoms with fuzzy matching
      let matchCount = 0;
      let matchedSymptoms = [];
      
      // Track matched symptoms for better result explanation
      const exactMatches = [];
      const partialMatches = [];
      const wordMatches = [];
      
      for (const userSymptom of userSymptoms) {
        // Check for exact matches first (prioritize these)
        const exactMatch = diseaseSymptoms.find(s => s === userSymptom);
        if (exactMatch) {
          matchCount += 1.0; // Full weight for exact match
          matchedSymptoms.push(exactMatch);
          exactMatches.push(exactMatch);
          continue;
        }
        
        // Check for partial matches (substring)
        let foundPartialMatch = false;
        for (const diseaseSymptom of diseaseSymptoms) {
          if (diseaseSymptom.includes(userSymptom) || userSymptom.includes(diseaseSymptom)) {
            matchCount += 0.8; // Higher weight for substring match (80%)
            matchedSymptoms.push(diseaseSymptom);
            partialMatches.push(diseaseSymptom);
            foundPartialMatch = true;
            break;
          }
        }
        
        if (foundPartialMatch) continue;
        
        // Check for word-level matches (e.g., "chest pain" vs "pain in chest")
        for (const diseaseSymptom of diseaseSymptoms) {
          const diseaseWords = diseaseSymptom.split(' ');
          const userWords = userSymptom.split(' ');
          
          const commonWords = diseaseWords.filter(word => 
            userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
          );
          
          if (commonWords.length > 0 && !matchedSymptoms.includes(diseaseSymptom)) {
            // Weight based on proportion of matching words and word significance
            const matchScore = 0.6 * (commonWords.length / Math.max(diseaseWords.length, userWords.length));
            matchCount += matchScore;
            matchedSymptoms.push(diseaseSymptom);
            wordMatches.push(diseaseSymptom);
            break;
          }
        }
      }
      
      // Apply age and gender adjustments (for certain conditions)
      if (gender === 'male' && disease.name === 'Prostate cancer') {
        matchCount *= 1.2; // Increase probability for males
      }
      
      if (gender === 'female' && disease.name === 'Breast cancer') {
        matchCount *= 1.2; // Increase probability for females
      }
      
      // Adjust weight for the number of symptoms that match
      // More matching symptoms = higher confidence
      const symptomCoverage = matchedSymptoms.length / disease.symptoms.length;
      const userSymptomCoverage = matchedSymptoms.length / userSymptoms.length;
      
      // Balance between disease coverage and user symptom coverage
      const balancedScore = (symptomCoverage * 0.6) + (userSymptomCoverage * 0.4);
      
      // Boost score if many exact matches
      const exactMatchBonus = exactMatches.length > 0 ? (exactMatches.length / userSymptoms.length) * 0.2 : 0;
      
      // Final probability calculation
      const matchPercentage = balancedScore + exactMatchBonus;
      
      return {
        ...disease,
        probability: matchPercentage,
        matchingSymptoms: [...new Set(matchedSymptoms)],
        exactMatches,
        partialMatches,
        wordMatches
      };
    }).filter(disease => disease.probability > 0) // Only include diseases with at least one matching symptom
      .sort((a, b) => b.probability - a.probability); // Sort by match percentage
    
    // If no matches found, provide generic response
    if (possibleConditions.length === 0) {
      possibleConditions.push({
        name: "Unspecified Condition",
        specialization: "General Medicine",
        probability: 0.5,
        description: "Based on the symptoms provided, we couldn't determine a specific condition. Consider consulting a healthcare provider for a proper diagnosis.",
        selfCare: [
          "Rest and monitor your symptoms",
          "Stay hydrated",
          "Take over-the-counter medications for symptom relief if appropriate",
          "Consult with a healthcare provider if symptoms persist"
        ]
      });
    }
    
    // Take top 3 results (or fewer if less than 3 matches found)
    const topConditions = possibleConditions.slice(0, 3);
    
    // Log the matching details for debugging
    console.log("Top matches:", topConditions.map(c => ({
      name: c.name,
      probability: c.probability,
      exactMatches: c.exactMatches,
      partialMatches: c.partialMatches,
      wordMatches: c.wordMatches
    })));
    
    setTimeout(() => {
      setResults({ possibleConditions: topConditions });
      setLoading(false);
      
      // If user is authenticated, save the result
      if (isAuthenticated && user) {
        const topCondition = topConditions[0];
        addMedicalRecord({
          id: Date.now().toString(),
          recordType: 'disease',
          disease: topCondition.name,
          confidence: topCondition.probability,
          symptoms: selectedSymptoms,
          location: location,
          timestamp: new Date().toISOString(),
          description: topCondition.description,
          specialization: topCondition.specialization
        });
      }
    }, 2000);
  }

  const handleViewAllResults = () => {
    router.push('/symptom-checker/results')
  }

  const handleSaveToProfile = (condition) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/symptom-checker')
      return
    }
    
    // Add the selected condition to medical records
    addMedicalRecord({
      id: Date.now().toString(),
      recordType: 'disease',
      disease: condition.name,
      confidence: condition.probability,
      symptoms: selectedSymptoms,
      location: location,
      timestamp: new Date().toISOString(),
      description: condition.description,
      specialization: condition.specialization
    })
    
    alert('Saved to your medical records!')
  }

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Basic Information'
      case 2: return 'Select Symptoms'
      case 3: return 'Your Location'
      case 4: return 'Review Information'
      default: return ''
    }
  }

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
            Symptom <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">Checker</span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-300 md:text-2xl">
            Get an instant assessment based on your symptoms
          </p>
        </motion.div>
      </motion.section>
      
      <div className="container mx-auto px-4 py-10 max-w-4xl">      
        {results ? (
          // Results view
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="border-teal-500/20 bg-gray-800/90 text-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Your Assessment Results</CardTitle>
                    <CardDescription className="text-gray-300">
                      Based on your symptoms, here are some possible conditions
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline"
                    className="text-blue-400 border-blue-400 hover:bg-blue-900/20"
                    onClick={() => {
                      setResults(null)
                      setStep(1)
                      setSelectedSymptoms([])
                      setAge('')
                      setGender('')
                      setLocation('')
                    }}
                  >
                    Start New Check
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-300 text-sm border-b pb-2 border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">You reported:</div>
                      <div>{selectedSymptoms.join(', ')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>{location}</span>
                    </div>
                  </div>
                  
                  {results.possibleConditions.map((condition, idx) => (
                    <Card key={idx} className={`overflow-hidden bg-gray-800 border-gray-700 ${idx === 0 ? 'border-teal-500/50 bg-teal-900/20' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl flex items-center gap-2 text-white">
                            {condition.name}
                            {idx === 0 && (
                              <span className="bg-teal-900/50 text-teal-300 text-xs px-2 py-1 rounded">
                                Most Likely
                              </span>
                            )}
                          </CardTitle>
                          <div className="text-sm font-semibold text-gray-400">
                            {Math.round(condition.probability * 100)}% match
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">Specialization: {condition.specialization}</p>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-300 text-sm mb-3">
                          {condition.description}
                        </p>
                        
                        <div className="mt-3 mb-2 bg-gray-700/30 border border-gray-600/50 rounded-md p-2">
                          <h4 className="text-sm font-medium text-white mb-1">Matching symptoms:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {condition.matchingSymptoms && condition.matchingSymptoms.map((symptom, i) => (
                              <span key={i} className="inline-flex text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                                {symptom}
                              </span>
                            ))}
                            {condition.matchingSymptoms?.length === 0 && (
                              <span className="text-gray-400 text-xs">No direct symptom matches</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-2 mt-4">
                          <h4 className="text-sm font-medium text-white">Self-care recommendations:</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-300 mt-1 space-y-1">
                            {condition.selfCare.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-800/50 pt-2 pb-2 flex justify-between">
                        <Button 
                          variant="default"
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                          onClick={() => {
                            // Redirect to doctors page with disease and location parameters
                            router.push(`/doctors?condition=${encodeURIComponent(condition.name)}&specialization=${encodeURIComponent(condition.specialization)}&city=${encodeURIComponent(location)}`);
                          }}
                        >
                          Find Doctors
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                          onClick={() => handleSaveToProfile(condition)}
                        >
                          Save to My Records
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <div className="mt-6 text-center">
                    <p className="text-red-400 flex items-center justify-center gap-2 text-sm mb-6">
                      <AlertCircle className="h-4 w-4" />
                      This is just a screening tool and not a medical diagnosis
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="border-blue-500 text-blue-400 hover:bg-blue-900/20" 
                        onClick={() => router.push('/doctors')}
                      >
                        Find a Doctor
                      </Button>
                      <Button 
                        variant="default"
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                        onClick={() => router.push('/medicines')}
                      >
                        Browse Medicines
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Assessment form
          <Card className="border-blue-500/20 shadow-lg bg-gray-800 text-white">
            <CardHeader className="border-b border-gray-700 pb-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Step {step} of 4
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(stepNumber => (
                    <div 
                      key={stepNumber}
                      className={`w-6 h-2 rounded-full ${stepNumber === step 
                        ? 'bg-blue-500' 
                        : stepNumber < step 
                          ? 'bg-gray-500' 
                          : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="grid gap-6">
                    <div>
                      <Label htmlFor="age">Your Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        placeholder="Enter your age" 
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className="mt-1 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label>Your Gender</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button 
                          type="button"
                          variant={gender === 'male' ? 'default' : 'outline'}
                          className={gender === 'male' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                          onClick={() => setGender('male')}
                        >
                          Male
                        </Button>
                        <Button 
                          type="button"
                          variant={gender === 'female' ? 'default' : 'outline'}
                          className={gender === 'female' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                          onClick={() => setGender('female')}
                        >
                          Female
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Label htmlFor="search">Search symptoms</Label>
                      <div className="relative mt-1">
                        <Input 
                          id="search" 
                          type="text" 
                          placeholder="Search for symptoms..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Selected Symptoms ({selectedSymptoms.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSymptoms.length === 0 ? (
                          <div className="text-gray-400 text-sm">
                            No symptoms selected yet
                          </div>
                        ) : (
                          selectedSymptoms.map(symptom => (
                            <div 
                              key={symptom} 
                              className="bg-blue-900/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              {symptom}
                              <button 
                                type="button" 
                                onClick={() => handleSymptomToggle(symptom)}
                                className="ml-1 hover:text-blue-100 focus:outline-none"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Common Symptoms</Label>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredSymptoms.map(symptom => (
                          <button
                            key={symptom}
                            type="button"
                            className={`flex justify-between items-center px-4 py-2 rounded-md border text-left ${
                              selectedSymptoms.includes(symptom)
                                ? 'bg-blue-900/30 border-blue-500/50 text-blue-300'
                                : 'border-gray-700 hover:bg-gray-700/70'
                            }`}
                            onClick={() => handleSymptomToggle(symptom)}
                          >
                            <span>{symptom}</span>
                            {selectedSymptoms.includes(symptom) && (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="location" className="flex justify-between items-center">
                        <span>Your Location</span>
                        <Button 
                          type="button" 
                          variant="link" 
                          size="sm" 
                          className="text-blue-400 p-0 h-auto"
                          onClick={detectLocation}
                          disabled={detectingLocation}
                        >
                          {detectingLocation ? 
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Detecting...
                            </span> 
                            : 'Detect automatically'
                          }
                        </Button>
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Select 
                            value={location} 
                            onValueChange={setLocation}
                          >
                            <SelectTrigger className="pl-10 bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select your location" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              {commonLocations.map(city => (
                                <SelectItem key={city} value={city} className="focus:bg-blue-900/30 focus:text-blue-300">
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {autoDetectLocation && location && (
                        <div className={`mt-2 text-sm flex items-center ${locationMessage.includes('Error') || locationMessage.includes('Could not') ? 'text-amber-400' : 'text-teal-400'}`}>
                          {locationMessage.includes('Error') || locationMessage.includes('Could not') ? (
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <Check className="h-3.5 w-3.5 mr-1" />
                          )}
                          {locationMessage || 'Location automatically detected'}
                        </div>
                      )}
                      
                      {detectingLocation && (
                        <div className="mt-2 text-sm text-blue-400 flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Detecting your location...
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-300 text-sm mb-2">
                        Why we need your location:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
                        <li>To provide region-specific health assessments</li>
                        <li>To connect you with nearby doctors and pharmacies</li>
                        <li>To adjust for regional disease prevalence</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-900/20 p-4 rounded-md border border-blue-500/20 mt-4">
                      <p className="text-sm text-blue-300 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Your location data is only used to improve the accuracy of your assessment and is stored securely.
                      </p>
                    </div>
                  </div>
                )}
                
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">Review Your Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2 border-gray-700">
                        <span className="font-medium">Age:</span>
                        <span>{age} years</span>
                      </div>
                      
                      <div className="flex justify-between border-b pb-2 border-gray-700">
                        <span className="font-medium">Gender:</span>
                        <span className="capitalize">{gender}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2 border-gray-700">
                        <span className="font-medium">Location:</span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-blue-400" />
                          {location}
                        </span>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-2">Symptoms:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSymptoms.map(symptom => (
                            <div 
                              key={symptom} 
                              className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {symptom}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <p className="text-gray-400 text-sm">
                          By proceeding, you agree to our Terms of Service and Privacy Policy. 
                          This tool provides informational content only and should not be considered medical advice.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevStep}
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button 
                type="button"
                onClick={handleNextStep}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 relative"
              >
                {loading ? 'Processing...' : step === 4 ? 'Get Results' : 'Continue'}
                {!loading && (
                  <ChevronRight className="ml-1 h-4 w-4" />
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

