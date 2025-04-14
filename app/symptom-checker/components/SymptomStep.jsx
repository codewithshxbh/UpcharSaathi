"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, X, ThumbsUp } from "lucide-react"

// Common symptoms grouped by body region
const commonSymptoms = {
  "Head & Neurological": [
    "Headache", "Dizziness", "Confusion", "Memory Loss", "Fainting", 
    "Blurred Vision", "Light Sensitivity"
  ],
  "Respiratory": [
    "Cough", "Shortness of Breath", "Wheezing", "Chest Pain", "Sore Throat",
    "Runny Nose", "Congestion"
  ],
  "Digestive": [
    "Nausea", "Vomiting", "Diarrhea", "Constipation", "Abdominal Pain",
    "Bloating", "Loss of Appetite"
  ],
  "Musculoskeletal": [
    "Joint Pain", "Muscle Ache", "Back Pain", "Stiffness", "Swelling",
    "Limited Range of Motion", "Muscle Weakness"
  ],
  "General": [
    "Fever", "Fatigue", "Chills", "Weight Loss", "Night Sweats",
    "Weakness", "Malaise"
  ],
  "Skin": [
    "Rash", "Itching", "Hives", "Dry Skin", "Skin Discoloration",
    "Bruising", "Swelling"
  ],
  "Cardiovascular": [
    "Chest Pain", "Palpitations", "High Blood Pressure", "Irregular Heartbeat",
    "Leg Swelling", "Shortness of Breath"
  ]
};

// Disease database - simplified for demonstration
// In a real app, this would come from a medical API
const diseaseDatabase = [
  {
    name: "Common Cold",
    symptoms: ["Runny Nose", "Sore Throat", "Cough", "Congestion", "Fever"],
    description: "A viral infectious disease of the upper respiratory tract that primarily affects the nose.",
    severity: "Mild",
    selfCare: true,
    recommendDoctor: false
  },
  {
    name: "Influenza",
    symptoms: ["Fever", "Cough", "Fatigue", "Muscle Ache", "Headache", "Chills"],
    description: "A viral infection that attacks your respiratory system — your nose, throat and lungs.",
    severity: "Moderate",
    selfCare: true,
    recommendDoctor: true
  },
  {
    name: "COVID-19",
    symptoms: ["Fever", "Cough", "Shortness of Breath", "Fatigue", "Loss of Taste", "Loss of Smell"],
    description: "An infectious disease caused by the SARS-CoV-2 virus.",
    severity: "Moderate to Severe",
    selfCare: false,
    recommendDoctor: true
  },
  {
    name: "Migraine",
    symptoms: ["Headache", "Light Sensitivity", "Nausea", "Blurred Vision"],
    description: "A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.",
    severity: "Moderate",
    selfCare: true,
    recommendDoctor: true
  },
  {
    name: "Gastroenteritis",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Fever"],
    description: "An intestinal infection marked by diarrhea, abdominal cramps, nausea, vomiting, and sometimes fever.",
    severity: "Moderate",
    selfCare: true,
    recommendDoctor: true
  },
  {
    name: "Hypertension",
    symptoms: ["High Blood Pressure", "Headache", "Shortness of Breath", "Chest Pain"],
    description: "A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.",
    severity: "Moderate to Severe",
    selfCare: false,
    recommendDoctor: true
  },
  {
    name: "Arthritis",
    symptoms: ["Joint Pain", "Swelling", "Stiffness", "Limited Range of Motion"],
    description: "Inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
    severity: "Moderate",
    selfCare: true,
    recommendDoctor: true
  },
  {
    name: "Allergic Reaction",
    symptoms: ["Rash", "Itching", "Hives", "Swelling", "Shortness of Breath"],
    description: "An immune system response to a substance that's not normally harmful.",
    severity: "Mild to Severe",
    selfCare: false,
    recommendDoctor: true
  },
  {
    name: "Depression",
    symptoms: ["Fatigue", "Loss of Appetite", "Weight Loss", "Memory Loss", "Malaise"],
    description: "A mental health disorder characterized by persistently depressed mood or loss of interest in activities.",
    severity: "Moderate to Severe",
    selfCare: false,
    recommendDoctor: true
  }
];

const SymptomStep = forwardRef(({ initialSymptoms = [], onSymptomChange }, ref) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState(initialSymptoms)
  const [activeCategory, setActiveCategory] = useState("All")
  
  useImperativeHandle(ref, () => ({
    resetSymptoms: () => {
      setSelectedSymptoms([])
      calculatePossibleDiseases([])
    }
  }))
  
  useEffect(() => {
    if (initialSymptoms.length > 0) {
      setSelectedSymptoms(initialSymptoms)
      calculatePossibleDiseases(initialSymptoms)
    }
  }, [initialSymptoms])
  
  // Function to add a symptom
  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      const updatedSymptoms = [...selectedSymptoms, symptom]
      setSelectedSymptoms(updatedSymptoms)
      calculatePossibleDiseases(updatedSymptoms)
      setSearchQuery("")
    }
  }
  
  // Function to remove a symptom
  const removeSymptom = (symptom) => {
    const updatedSymptoms = selectedSymptoms.filter(s => s !== symptom)
    setSelectedSymptoms(updatedSymptoms)
    calculatePossibleDiseases(updatedSymptoms)
  }
  
  // Calculate possible diseases based on symptoms
  const calculatePossibleDiseases = (symptoms) => {
    if (symptoms.length === 0) {
      onSymptomChange([], [])
      return
    }
    
    // Calculate disease match percentage
    const possibleDiseases = diseaseDatabase.map(disease => {
      const matchingSymptoms = disease.symptoms.filter(s => symptoms.includes(s))
      const matchPercentage = (matchingSymptoms.length / disease.symptoms.length) * 100
      
      return {
        ...disease,
        matchPercentage: Math.round(matchPercentage),
        matchingSymptoms
      }
    }).filter(disease => disease.matchPercentage > 20) // Only diseases with >20% match
    
    // Sort by match percentage
    possibleDiseases.sort((a, b) => b.matchPercentage - a.matchPercentage)
    
    onSymptomChange(possibleDiseases, symptoms)
  }
  
  // Get filtered symptoms based on search query and category
  const getFilteredSymptoms = () => {
    if (activeCategory === "All") {
      return Object.values(commonSymptoms).flat().filter(
        symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase())
      )
    } else {
      return commonSymptoms[activeCategory].filter(
        symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  }
  
  // Get all categories including "All"
  const categories = ["All", ...Object.keys(commonSymptoms)]
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Select Your Symptoms</h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-700/50 border-gray-600 text-white"
          />
        </div>
      </div>
      
      {/* Categories tabs */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-full text-sm ${
                activeCategory === category 
                  ? "bg-gradient-to-r from-blue-600 to-teal-600" 
                  : "border-gray-700 text-gray-300 hover:border-blue-500/50 hover:text-blue-400"
              }`}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Selected symptoms */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.length > 0 ? (
            selectedSymptoms.map(symptom => (
              <Badge 
                key={symptom} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 pl-2 pr-1"
              >
                {symptom}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1 text-blue-100 hover:text-blue-200 hover:bg-blue-700/50"
                  onClick={() => removeSymptom(symptom)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No symptoms selected</p>
          )}
        </div>
      </div>
      
      {/* Symptom suggestions */}
      <Card className="bg-gray-700/30 border-gray-700">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Common Symptoms</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {getFilteredSymptoms().slice(0, 18).map(symptom => (
              <Button
                key={symptom}
                variant="outline"
                size="sm"
                className={`justify-start text-left border-gray-600 hover:border-blue-500 hover:bg-blue-900/20 ${
                  selectedSymptoms.includes(symptom) ? "text-blue-400 border-blue-500" : "text-gray-300"
                }`}
                onClick={() => addSymptom(symptom)}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                {symptom}
              </Button>
            ))}
          </div>
          
          {getFilteredSymptoms().length === 0 && (
            <p className="text-gray-400 text-sm py-2">No symptoms found matching your search</p>
          )}
        </CardContent>
      </Card>
      
      {selectedSymptoms.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-blue-300 text-sm flex items-center">
          <ThumbsUp className="h-5 w-5 mr-2 text-blue-500" />
          <p>
            {selectedSymptoms.length} {selectedSymptoms.length === 1 ? 'symptom' : 'symptoms'} selected. 
            Add more symptoms for more accurate results.
          </p>
        </div>
      )}
    </div>
  )
})

SymptomStep.displayName = "SymptomStep"

export default SymptomStep