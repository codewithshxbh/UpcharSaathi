'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Pill, ArrowRight, MoveRight, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConfirmationPage() {
  const router = useRouter();
  const [orderId] = useState(`ORD${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 2);
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
  });

  useEffect(() => {
    // Trigger confetti effect on page load
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const runConfetti = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#14B8A6', '#60A5FA'],
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#14B8A6', '#60A5FA'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(runConfetti);
      }
    };

    runConfetti();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="bg-gray-800 border-gray-700 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-teal-600" />
          
          <CardHeader className="text-center pt-12 pb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="mx-auto mb-6 h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle2 className="h-14 w-14 text-green-400" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white mb-2">Order Confirmed!</CardTitle>
            <p className="text-blue-400 font-medium">Thank you for your purchase</p>
          </CardHeader>
          
          <CardContent className="pb-12 space-y-8">
            <div className="bg-gray-700/50 rounded-lg border border-gray-600 p-6">
              <h3 className="text-white font-medium mb-4">Order Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Order ID</p>
                  <p className="text-white font-medium">{orderId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Order Date</p>
                  <p className="text-white font-medium">
                    {new Date().toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Payment Method</p>
                  <p className="text-white font-medium">Demo Payment</p>
                </div>
                <div>
                  <p className="text-gray-400">Order Status</p>
                  <p className="text-green-400 font-medium">Processing</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700" />
              <div className="relative flex justify-between">
                {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                      index === 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index === 0 ? '✓' : index + 1}
                    </div>
                    <div className="text-xs mt-2 text-center">
                      <p className={index === 0 ? 'text-green-400' : 'text-gray-400'}>
                        {step}
                      </p>
                      {index === 0 && (
                        <p className="text-gray-500">
                          {new Date().toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-700/40 border-gray-600">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Delivery Expected</p>
                    <p className="text-blue-400 text-xs">{estimatedDelivery}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700/40 border-gray-600">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Pill className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Order Details</p>
                    <p className="text-blue-400 text-xs">Medicines & Health Products</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700/40 border-gray-600">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Shipping Address</p>
                    <p className="text-blue-400 text-xs">Your default address</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <p className="text-gray-300">
                A confirmation email has been sent to your registered email address.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/medicines')}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                >
                  Continue Shopping
                </Button>
                
                <Button
                  onClick={() => router.push('/profile')}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  Track My Order <MoveRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}