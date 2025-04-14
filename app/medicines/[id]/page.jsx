import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShoppingCart, Plus, Minus, AlertTriangle, FileText, Truck } from 'lucide-react'

// This function runs on the server at request time
export async function generateMetadata({ params }) {
  // In a real app, fetch medicine data based on params.id
  return {
    title: `Medicine Details | Upchar Saathi`,
  }
}

// Simulated medicine data (replace with actual database fetch)
const getMedicine = async (id) => {
  // In production, this would be a database fetch
  return {
    id,
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Cipla Ltd',
    description: 'Paracetamol is a pain reliever and a fever reducer. It is used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    usageInstructions: 'Take this medicine by mouth with or without food. Follow the directions on the product package or take as directed by your doctor. If you are taking the suspension, use a medication measuring device to carefully measure the dose.',
    dosage: '1-2 tablets every 4-6 hours as needed',
    price: 35.00,
    discountPrice: 29.75,
    stock: 150,
    image: '/placeholder.svg',
    requiresPrescription: false,
    categoryId: '1',
    category: {
      name: 'Pain Relief'
    }
  }
}

// Create a client component for interactive elements
import MedicineClient from './MedicineClient'

export default async function MedicineDetails({ params }) {
  // Fetch medicine data on server
  const medicine = await getMedicine(params.id)
  
  if (!medicine) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto p-8 rounded-xl bg-red-900/20 border border-red-700">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Medicine Not Found</h1>
          <p className="text-gray-300 mb-6">Sorry, we couldn't find the medicine you're looking for.</p>
          <Button 
            href="/medicines"
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          >
            Back to Medicines
          </Button>
        </div>
      </div>
    )
  }

  return <MedicineClient medicine={medicine} />
}