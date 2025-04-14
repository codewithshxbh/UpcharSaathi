"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Medical background questions
const medicalQuestions = [
  { 
    id: 1, 
    question: "Do you have high blood pressure?",
    options: ["Yes", "No", "Not Sure"]
  },
  { 
    id: 2, 
    question: "Do you have diabetes?",
    options: ["Yes", "No", "Not Sure"]
  },
  { 
    id: 3, 
    question: "Do you smoke?",
    options: ["Yes", "No", "Occasionally"]
  },
  { 
    id: 4, 
    question: "Do you have any allergies?",
    options: ["Yes", "No", "Not Sure"]
  },
  { 
    id: 5, 
    question: "Are you currently taking any medications?",
    options: ["Yes", "No"]
  }
]

export default function Patient2Step({ onQuestionAnswered, initialQuestions = [] }) {
  const [patientAnswers, setPatientAnswers] = useState([])
  
  // Initialize questions with answers if we have existing data
  useEffect(() => {
    if (initialQuestions.length > 0) {
      setPatientAnswers(initialQuestions)
    } else {
      // Initialize with empty answers
      const initialAnswers = medicalQuestions.map(q => ({
        id: q.id,
        question: q.question,
        answer: ""
      }))
      setPatientAnswers(initialAnswers)
    }
  }, [initialQuestions])
  
  // Update answer for a specific question
  const handleAnswerChange = (questionId, answer) => {
    const updatedAnswers = patientAnswers.map(q => 
      q.id === questionId ? { ...q, answer } : q
    )
    
    setPatientAnswers(updatedAnswers)
    onQuestionAnswered(updatedAnswers)
  }
  
  return (
    <div className="space-y-8">
      <p className="text-gray-300">
        Please answer these questions about your medical history to help us provide more accurate results.
      </p>
      
      <div className="space-y-6">
        {medicalQuestions.map((q) => {
          // Find answer for this question if it exists
          const questionData = patientAnswers.find(item => item.id === q.id) || { answer: "" }
          
          return (
            <div key={q.id} className="space-y-3 pb-4 border-b border-gray-700">
              <h4 className="font-medium text-white">{q.question}</h4>
              
              <RadioGroup
                value={questionData.answer}
                onValueChange={(value) => handleAnswerChange(q.id, value)}
                className="flex flex-wrap gap-3"
              >
                {q.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option} 
                      id={`q${q.id}-${option}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`q${q.id}-${option}`}
                      className={`
                        px-4 py-2 rounded-full border cursor-pointer transition-all duration-200
                        ${questionData.answer === option
                          ? 'bg-blue-900/40 border-blue-500 text-blue-400' 
                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-blue-500/30'}
                      `}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )
        })}
      </div>
      
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-blue-300 text-sm">
        <p>
          Your medical history helps us evaluate your symptoms in the context of existing health conditions.
          All answers are confidential and used only for the purpose of this symptom check.
        </p>
      </div>
    </div>
  )
}