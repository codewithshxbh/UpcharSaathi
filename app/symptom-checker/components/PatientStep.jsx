"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PatientStep({ gender, age, onGenderChange, onAgeChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Age</Label>
          <Input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            className="w-full bg-gray-700/50 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your age"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Gender</Label>
          <RadioGroup
            defaultValue={gender}
            value={gender}
            onValueChange={onGenderChange}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" }
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={item.value} 
                  id={item.value}
                  className="sr-only"
                />
                <Label
                  htmlFor={item.value}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border w-full cursor-pointer transition-all duration-200
                    ${gender === item.value 
                      ? 'bg-blue-900/40 border-blue-500 text-blue-400' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-blue-500/30'}
                  `}
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-blue-300 text-sm">
        <p>
          Your age and gender help us provide more accurate symptom analysis and 
          recommendations based on demographic health patterns.
        </p>
      </div>
    </div>
  )
}