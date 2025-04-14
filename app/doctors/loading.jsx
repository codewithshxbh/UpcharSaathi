"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DoctorsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16">
      {/* Loading Hero Section */}
      <section className="relative py-16 text-center bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(66,103,255,0.8),transparent_70%)]" />
        
        <div className="relative z-10 max-w-4xl px-4 mx-auto">
          <div className="mb-6">
            <Skeleton className="h-12 w-3/4 mx-auto bg-gray-800" />
          </div>
          <Skeleton className="h-6 w-2/3 mx-auto bg-gray-800" />
        </div>
      </section>

      {/* Loading Content */}
      <section className="max-w-7xl mx-auto px-4 mt-6 mb-8">
        <div className="border-b border-gray-700 mb-6">
          <div className="flex gap-6 pb-3">
            <Skeleton className="h-10 w-40 bg-gray-800" />
            <Skeleton className="h-10 w-40 bg-gray-800" />
          </div>
        </div>

        {/* Loading Recommendation UI */}
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 shadow-lg shadow-blue-500/10">
          <div className="mb-6">
            <Skeleton className="h-8 w-72 mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-700" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Skeleton className="h-4 w-36 mb-2 bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-700" />
            </div>
            <div>
              <Skeleton className="h-4 w-36 mb-2 bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-700" />
            </div>
          </div>
          
          <Skeleton className="h-14 w-full bg-gray-700" />
        </div>

        {/* Loading Doctor Cards */}
        <div className="mt-10 space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-gray-800 border border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-24 w-24 rounded-full bg-gray-700" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48 bg-gray-700" />
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-24 bg-gray-700" />
                      <Skeleton className="h-4 w-24 bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-64 bg-gray-700" />
                    <Skeleton className="h-6 w-28 bg-gray-700 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <Skeleton className="h-10 w-full bg-gray-700" />
                    <Skeleton className="h-10 w-full bg-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

