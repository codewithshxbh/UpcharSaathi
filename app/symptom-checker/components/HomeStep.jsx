"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function HomeStep({ isChecked, onCheckChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Welcome to Upchar Saathi Symptom Checker</h3>
        
        <p className="text-gray-300">
          This tool is designed to help you understand potential causes for your symptoms and provide guidance on next steps. 
          Please note that this is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
        
        <Alert className="bg-blue-900/20 border-blue-800/30">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            Always consult with a healthcare professional for proper medical advice.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
        <h4 className="font-medium text-white">Terms of Use</h4>
        
        <div className="space-y-2 text-sm text-gray-300">
          <p>By using this symptom checker, you agree to the following:</p>
          
          <ul className="list-disc pl-5 space-y-1">
            <li>This tool provides informational content only and is not a substitute for professional medical advice.</li>
            <li>The results are based on the information you provide and may not be accurate in all cases.</li>
            <li>For medical emergencies, please call emergency services immediately.</li>
            <li>Your information is processed as per our privacy policy.</li>
          </ul>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={isChecked}
            onCheckedChange={onCheckChange}
          />
          <Label 
            htmlFor="terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
          >
            I understand and agree to the terms of use
          </Label>
        </div>
      </div>
    </div>
  )
}