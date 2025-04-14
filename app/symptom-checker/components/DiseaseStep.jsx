"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Check, 
  Info, 
  Stethoscope, 
  ThumbsUp, 
  User, 
  Calendar,
  ArrowRight,
  Save
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function DiseaseStep({ patientInfo, diseases, gender, age, symptoms }) {
  const router = useRouter()
  const { user, isAuthenticated, addMedicalRecord } = useAuth()
  const { toast } = useToast()
  const [savedToMedicalRecords, setSavedToMedicalRecords] = useState(false)
  
  // Always use the highest priority disease (already sorted by match percentage)
  const highestPriorityDisease = diseases.length > 0 ? diseases[0] : null
  
  // Get severity color based on the severity level
  const getSeverityColor = (severity) => {
    if (severity.toLowerCase().includes("mild")) {
      return "text-green-400 bg-green-900/30 border-green-800/30"
    } else if (severity.toLowerCase().includes("moderate")) {
      return "text-yellow-400 bg-yellow-900/30 border-yellow-800/30"
    } else {
      return "text-red-400 bg-red-900/30 border-red-800/30"
    }
  }
  
  // Determine if doctor consultation is recommended
  const isDoctorRecommended = () => {
    if (!highestPriorityDisease) return false
    
    // If the disease specifically recommends a doctor
    if (highestPriorityDisease.recommendDoctor) return true
    
    // If the disease is severe
    if (highestPriorityDisease.severity.toLowerCase().includes("severe")) return true
    
    // If the patient has multiple risk factors from medical history
    const riskFactors = patientInfo.filter(q => 
      q.answer === "Yes" && 
      (q.question.includes("high blood pressure") || 
       q.question.includes("diabetes") || 
       q.question.includes("medications"))
    )
    
    if (riskFactors.length >= 2) return true
    
    // If senior citizen
    if (parseInt(age) > 65 && highestPriorityDisease.severity !== "Mild") return true
    
    return false
  }
  
  // Navigate to doctors page with the disease pre-filled
  const navigateToDoctors = () => {
    if (highestPriorityDisease) {
      router.push(`/doctors?condition=${encodeURIComponent(highestPriorityDisease.name)}`)
    } else {
      router.push('/doctors')
    }
  }

  // Save disease data to medical records
  const saveToMedicalRecords = () => {
    if (!isAuthenticated || !highestPriorityDisease) {
      if (!isAuthenticated) {
        toast({
          title: "Login Required",
          description: "Please log in to save your medical records",
          variant: "default"
        })
      }
      return
    }

    // Create record object
    const medicalRecord = {
      type: "symptom-check",
      condition: highestPriorityDisease.name,
      severity: highestPriorityDisease.severity,
      matchPercentage: highestPriorityDisease.matchPercentage,
      symptoms: symptoms,
      matchingSymptoms: highestPriorityDisease.matchingSymptoms,
      description: highestPriorityDisease.description, // Add description to store disease information
      patientInfo: {
        age,
        gender
      },
      doctorRecommended: isDoctorRecommended(),
      date: new Date().toISOString() // Add current date for record keeping
    }

    // Add record to user's medical records through context
    const success = addMedicalRecord(medicalRecord)
    
    if (success) {
      setSavedToMedicalRecords(true)
      toast({
        title: "Saved to Medical Records",
        description: "This health check has been added to your medical history",
        variant: "success"
      })
    } else {
      toast({
        title: "Error Saving Record",
        description: "Failed to save to your medical records",
        variant: "destructive"
      })
    }
  }

  // Prompt user to log in to save medical records
  const promptLogin = () => {
    router.push('/auth/login?redirect=/symptom-checker')
  }

  // View medical records
  const viewMedicalRecords = () => {
    router.push('/profile?tab=medical')
  }
  
  return (
    <div className="space-y-6">
      {highestPriorityDisease ? (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-blue-400" />
              Highest Probability Condition
            </h3>
            
            <p className="text-gray-300">
              Based on your reported symptoms ({symptoms.join(", ")}), we've identified the following potential condition. 
              Please consult a healthcare professional for a proper diagnosis.
            </p>
          </div>
          
          <Card className="bg-gray-700/30 border-gray-700">
            <CardContent className="p-6 space-y-5">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium text-white">{highestPriorityDisease.name}</h3>
                    <div className="flex items-center mt-1.5">
                      <Progress 
                        value={highestPriorityDisease.matchPercentage} 
                        className="h-2 w-32 bg-gray-700" 
                      />
                      <span className="text-sm text-blue-400 ml-2">{highestPriorityDisease.matchPercentage}% match</span>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(highestPriorityDisease.severity)}>
                    {highestPriorityDisease.severity} Severity
                  </Badge>
                </div>
                <p className="text-gray-300 mt-3">{highestPriorityDisease.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Matching Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {highestPriorityDisease.matchingSymptoms.map(symptom => (
                    <Badge key={symptom} variant="outline" className="bg-blue-900/20 border-blue-500/50 text-blue-400">
                      <Check className="h-3 w-3 mr-1 text-blue-500" /> {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Patient profile */}
              <div className="border-t border-b border-gray-700 py-4">
                <div className="flex items-center text-sm text-gray-300">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {gender === "male" ? "Male" : gender === "female" ? "Female" : "Person"}, {age} years
                  </span>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Recommendations</h4>
                
                {highestPriorityDisease.selfCare && (
                  <div className="flex items-start bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                    <ThumbsUp className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-blue-300 font-medium">Self-Care May Help</p>
                      <p className="text-sm text-blue-200 mt-1">
                        This condition may improve with rest and self-care measures. Monitor your symptoms.
                      </p>
                    </div>
                  </div>
                )}
                
                {isDoctorRecommended() ? (
                  <div className="flex items-start bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-yellow-300 font-medium">Doctor Consultation Recommended</p>
                      <p className="text-sm text-yellow-200 mt-1">
                        Based on your symptoms and profile, we recommend consulting a healthcare professional.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                    <Info className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-green-300 font-medium">Monitor Your Symptoms</p>
                      <p className="text-sm text-green-200 mt-1">
                        Keep track of your symptoms and consult a doctor if they worsen or persist.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex flex-col gap-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                onClick={navigateToDoctors}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Find Doctors for {highestPriorityDisease.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {!isAuthenticated ? (
                <Button 
                  variant="outline"
                  className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-950/30"
                  onClick={promptLogin}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Log in to save to your medical records
                </Button>
              ) : !savedToMedicalRecords ? (
                <Button 
                  variant="outline"
                  className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-950/30"
                  onClick={saveToMedicalRecords}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to medical records
                </Button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <div className="w-full text-center text-sm text-green-400 flex items-center justify-center">
                    <Check className="h-4 w-4 mr-2" />
                    Saved to your medical records
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-950/30"
                    onClick={viewMedicalRecords}
                  >
                    View in your profile
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          
          <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-red-300 text-sm">
            <p className="font-medium">Important Disclaimer</p>
            <p className="mt-1">
              This symptom checker provides information for educational purposes only and is not a qualified medical opinion. 
              Always consult with a qualified healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400">No conditions found matching your symptoms.</div>
          <p className="text-gray-500 text-sm mt-2">
            Please go back and add more symptoms for better results.
          </p>
        </div>
      )}
    </div>
  )
}