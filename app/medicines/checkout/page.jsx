'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, ShoppingBag, Trash2, Upload, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isPrescriptionRequired, handlePrescriptionUpload, completeOrder } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    prescriptionFile: null
  })
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Cart is Empty</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-300 mb-6">You haven't added any medicines to your cart yet.</p>
              <Button 
                onClick={() => router.push('/medicines')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Browse Medicines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, prescriptionFile: file }))
      handlePrescriptionUpload(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create shipping details object
      const shippingDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
      }
      
      // Process order
      await completeOrder(shippingDetails)
      
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('There was a problem processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate subtotal
  const subtotal = getTotalPrice()
  
  // Calculate shipping fee (example: free over ₹500, otherwise ₹50)
  const shippingFee = subtotal >= 500 ? 0 : 50
  
  // Calculate total
  const total = subtotal + shippingFee

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Summary */}
          <div className="lg:w-2/5">
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 bg-gray-700 rounded">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="text-gray-300 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-blue-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <Separator className="bg-gray-700" />
              <CardFooter className="flex flex-col pt-6">
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <Separator className="bg-gray-700 my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-200">Total</span>
                    <span className="text-blue-400">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {isPrescriptionRequired() && (
              <Card className="bg-yellow-900/20 border-yellow-700/50 mb-6">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-yellow-400 text-lg">Prescription Required</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-yellow-200/80">
                  <p className="mb-4">One or more items in your cart require a valid prescription.</p>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-dashed border-yellow-600/40">
                    <Label htmlFor="prescription" className="block mb-2 text-yellow-300">
                      Upload Prescription
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="prescription"
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={handleFileChange}
                        className="bg-gray-800 border-yellow-700/50 text-gray-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-yellow-600/70 text-yellow-400 hover:bg-yellow-900/30"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Browse
                      </Button>
                    </div>
                    {formData.prescriptionFile && (
                      <p className="mt-2 text-sm text-green-400">
                        ✓ {formData.prescriptionFile.name} uploaded successfully
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Shipping & Payment Form */}
          <div className="lg:flex-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Shipping & Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-gray-300">Street Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, Apartment 4B"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-gray-300">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-300">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-gray-300">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        required
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700 my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      Payment Method
                    </h3>
                    <p className="text-gray-300 mb-4">
                      This is a demo checkout. In production, you would see payment options here. 
                      No actual payment will be processed.
                    </p>
                    
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border border-blue-500/30 rounded-lg bg-blue-900/10 text-white flex items-center justify-between mb-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded flex items-center justify-center text-xs font-bold">
                          DEMO
                        </div>
                        <span>Simulated Payment</span>
                      </div>
                      <div className="h-5 w-5 rounded-full border-2 border-blue-400 flex items-center justify-center">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full p-6 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 font-semibold text-lg"
                    disabled={isSubmitting || (isPrescriptionRequired() && !formData.prescriptionFile)}
                  >
                    {isSubmitting ? (
                      <>Processing Order...</>
                    ) : (
                      <>Complete Purchase • ₹{total.toFixed(2)}</>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center mt-4">
                    By completing this purchase, you agree to our 
                    <span className="text-blue-400 cursor-pointer"> Terms of Service</span> and 
                    <span className="text-blue-400 cursor-pointer"> Privacy Policy</span>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}