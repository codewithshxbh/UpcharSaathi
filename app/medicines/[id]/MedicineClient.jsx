'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShoppingCart, Plus, Minus, AlertTriangle, FileText, Truck } from 'lucide-react'

export default function MedicineClient({ medicine }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart, cart } = useCart()
  const router = useRouter()

  // Check if item is already in cart
  const itemInCart = medicine && cart.find(item => item.id === medicine.id)
  const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0

  const handleAddToCart = () => {
    if (medicine) {
      addToCart(medicine, quantity)
    }
  }

  const increaseQuantity = () => {
    if (medicine && quantity < medicine.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <span className="hover:text-blue-400 cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span>›</span>
          <span className="hover:text-blue-400 cursor-pointer" onClick={() => router.push('/medicines')}>Medicines</span>
          <span>›</span>
          <span className="text-gray-300">{medicine.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Medicine Image */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="relative aspect-square w-full">
                <Image
                  src={medicine.image}
                  alt={medicine.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Medicine Info */}
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-white mb-2">{medicine.name}</h1>
            <p className="text-gray-400 mb-4">{medicine.genericName} • {medicine.manufacturer}</p>
            
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-blue-900/60 text-blue-300 px-3 py-1">
                {medicine.category.name}
              </Badge>
              {medicine.requiresPrescription && (
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 px-3 py-1">
                  Prescription Required
                </Badge>
              )}
              {medicine.stock > 0 ? (
                <Badge className="bg-green-900/60 text-green-300 px-3 py-1">
                  In Stock ({medicine.stock})
                </Badge>
              ) : (
                <Badge className="bg-red-900/60 text-red-300 px-3 py-1">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white">₹{medicine.discountPrice}</span>
              {medicine.discountPrice < medicine.price && (
                <span className="text-xl text-gray-400 line-through">₹{medicine.price}</span>
              )}
              {medicine.discountPrice < medicine.price && (
                <span className="text-green-400 font-semibold">
                  {Math.round((1 - medicine.discountPrice / medicine.price) * 100)}% off
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-white font-medium">
                  {quantity}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= medicine.stock}
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={medicine.stock === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 font-medium"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentQuantityInCart > 0 
                  ? `Update Cart (${currentQuantityInCart} in cart)` 
                  : 'Add to Cart'}
              </Button>
            </div>

            {medicine.requiresPrescription && (
              <Alert className="bg-yellow-900/20 border-yellow-700/50 mb-6">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <AlertTitle className="text-yellow-400">Prescription Required</AlertTitle>
                <AlertDescription className="text-yellow-200/80">
                  This medicine requires a valid prescription. You will need to upload your prescription during checkout.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <span>Dosage: {medicine.dosage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-400" />
                <span>Free delivery on orders over ₹500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-b border-gray-700">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="usage">Usage Instructions</TabsTrigger>
            <TabsTrigger value="info">Additional Info</TabsTrigger>
          </TabsList>
          <TabsContent 
            value="description" 
            className="p-6 bg-gray-800/50 border border-gray-700 rounded-b-lg text-gray-300"
          >
            <p>{medicine.description}</p>
          </TabsContent>
          <TabsContent 
            value="usage" 
            className="p-6 bg-gray-800/50 border border-gray-700 rounded-b-lg text-gray-300"
          >
            <p>{medicine.usageInstructions}</p>
          </TabsContent>
          <TabsContent 
            value="info" 
            className="p-6 bg-gray-800/50 border border-gray-700 rounded-b-lg text-gray-300"
          >
            <p>Store at room temperature away from light and moisture. Do not store in the bathroom. Keep all medications away from children and pets.</p>
            <p className="mt-4">Do not flush medications down the toilet or pour them into a drain unless instructed to do so. Properly discard this product when it is expired or no longer needed.</p>
          </TabsContent>
        </Tabs>
        
        {/* Similar Products */}
        <h2 className="text-2xl font-bold text-white mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all overflow-hidden">
              <div className="relative aspect-square bg-gray-700">
                <Image
                  src="/placeholder.svg"
                  alt="Similar medicine"
                  fill
                  className="object-cover p-4"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-1">Similar Medicine {item}</h3>
                <p className="text-gray-400 text-sm mb-2">Generic Medicine Co.</p>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">₹{(Math.random() * 100 + 20).toFixed(2)}</span>
                  <Button variant="secondary" size="sm" className="text-xs">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}