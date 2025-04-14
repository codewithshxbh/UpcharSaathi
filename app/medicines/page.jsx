'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Search, ShoppingCart, Clock, Filter, MapPin, Star, Plus, Minus } from 'lucide-react'

export default function MedicinesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { cart, addToCart, removeFromCart, totalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [medicines, setMedicines] = useState([])

  // Sample medicine data - in a real app, you'd fetch this from an API
  useEffect(() => {
    // Simulate API loading
    setIsLoading(true)
    
    // This is where you'd typically call your API
    // For example: fetch('https://api.medicineapi.com/medicines')
    
    // For now using sample data
    setTimeout(() => {
      const sampleMedicines = [
        {
          id: 1, 
          name: 'Paracetamol', 
          generic: 'Acetaminophen', 
          category: 'otc',
          price: 120, 
          manufacturer: 'HealthCare Pharma',
          prescription: false,
          rating: 4.5,
          stock: 'In Stock',
          deliveryTime: '2-4 hours',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 2, 
          name: 'Amoxicillin', 
          generic: 'Amoxicillin Trihydrate', 
          category: 'prescription',
          price: 240, 
          manufacturer: 'MediPharm',
          prescription: true,
          rating: 4.3,
          stock: 'In Stock',
          deliveryTime: 'Same Day',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 3, 
          name: 'Cetirizine', 
          generic: 'Cetirizine Hydrochloride', 
          category: 'otc',
          price: 85, 
          manufacturer: 'AllerRelief',
          prescription: false,
          rating: 4.7,
          stock: 'In Stock',
          deliveryTime: '1-3 hours',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 4, 
          name: 'Vitamin D3', 
          generic: 'Cholecalciferol', 
          category: 'supplement',
          price: 350, 
          manufacturer: 'VitaHealth',
          prescription: false,
          rating: 4.8,
          stock: 'In Stock',
          deliveryTime: 'Standard (1-2 days)',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 5, 
          name: 'Insulin Glargine', 
          generic: 'Insulin Glargine', 
          category: 'prescription',
          price: 1200, 
          manufacturer: 'DiabeCare',
          prescription: true,
          rating: 4.9,
          stock: 'Limited Stock',
          deliveryTime: 'Express (3-5 hours)',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 6, 
          name: 'Multivitamin', 
          generic: 'Multiple Vitamins', 
          category: 'supplement',
          price: 450, 
          manufacturer: 'NutriFit',
          prescription: false,
          rating: 4.6,
          stock: 'In Stock',
          deliveryTime: 'Standard (1-2 days)',
          imageUrl: '/placeholder.svg'
        },
      ]
      setMedicines(sampleMedicines)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredMedicines = medicines.filter(medicine => {
    // Filter by tab
    if (activeTab !== 'all' && medicine.category !== activeTab) {
      return false
    }
    
    // Filter by search
    if (searchQuery && !medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !medicine.generic.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  // Navigate to medicine detail page
  const viewMedicineDetails = (id) => {
    router.push(`/medicines/${id}`)
  }

  const handleCheckout = () => {
    router.push('/medicines/checkout')
  }

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16">
      {/* Hero Section */}
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
            Medicine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">Delivery</span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-300 md:text-2xl">
            Search, order, and get medicines delivered to your doorstep
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search medicines by name or generic..."
              className="w-full py-6 pl-12 bg-gray-800 border-blue-400/30 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3 h-6 w-6 text-gray-400" />
          </div>
        </motion.div>
      </motion.section>
      
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="otc">OTC</TabsTrigger>
                  <TabsTrigger value="prescription">Prescription</TabsTrigger>
                  <TabsTrigger value="supplement">Supplements</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="bg-gray-800 border border-gray-700 text-gray-100 shadow-md">
                    <CardContent className="p-0">
                      <div className="w-full h-40 bg-gray-700 animate-pulse"></div>
                    </CardContent>
                    <CardHeader>
                      <div className="w-3/4 h-6 bg-gray-700 animate-pulse mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-700 animate-pulse"></div>
                    </CardHeader>
                    <CardFooter>
                      <div className="w-1/4 h-8 bg-gray-700 animate-pulse mr-2"></div>
                      <div className="w-1/4 h-8 bg-blue-900 animate-pulse"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-white">
                    {filteredMedicines.length} {filteredMedicines.length === 1 ? 'Result' : 'Results'}
                  </h2>
                  <Button variant="outline" size="sm" className="text-white border-gray-600">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMedicines.map(medicine => (
                    <motion.div
                      key={medicine.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="bg-gray-800 border border-gray-700 text-gray-100 shadow-md hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
                        <div 
                          className="relative"
                          onClick={() => viewMedicineDetails(medicine.id)}
                        >
                          <img 
                            src={medicine.imageUrl} 
                            alt={medicine.name} 
                            className="w-full h-40 object-cover bg-gray-700" 
                          />
                          {medicine.prescription && (
                            <Badge className="absolute top-2 right-2 bg-amber-600">
                              Prescription Required
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <div 
                            className="flex justify-between"
                            onClick={() => viewMedicineDetails(medicine.id)}
                          >
                            <CardTitle className="text-white">{medicine.name}</CardTitle>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-300">{medicine.rating}</span>
                            </div>
                          </div>
                          <CardDescription 
                            className="text-gray-400"
                            onClick={() => viewMedicineDetails(medicine.id)}
                          >
                            {medicine.generic} • {medicine.manufacturer}
                          </CardDescription>
                        </CardHeader>
                        <CardContent onClick={() => viewMedicineDetails(medicine.id)}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xl font-semibold">₹{medicine.price}</p>
                              <p className="text-sm text-green-400">{medicine.stock}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-blue-400">{medicine.deliveryTime}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          {medicine.prescription ? (
                            <Button 
                              variant="outline" 
                              className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/20"
                              onClick={() => viewMedicineDetails(medicine.id)}
                            >
                              View Details
                            </Button>
                          ) : (
                            <Button 
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                              onClick={() => addToCart(medicine)}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Cart Sidebar */}
          <div className="w-full md:w-80 md:min-w-[320px]">
            <Card className="bg-gray-800 border border-gray-700 text-white sticky top-24">
              <CardHeader className="bg-gradient-to-r from-blue-900/60 to-teal-900/60">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Your Cart ({totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-2">Add medicines to proceed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between border-b border-gray-700 pb-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 rounded-full"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Subtotal</span>
                        <span>₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Delivery Fee</span>
                        <span>{totalAmount > 500 ? 'Free' : '₹50'}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg mt-4">
                        <span>Total</span>
                        <span>₹{totalAmount > 500 ? totalAmount : totalAmount + 50}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                      
                      <div className="mt-4 flex items-center justify-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        Deliver to: Home Address
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}