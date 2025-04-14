import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16">
      {/* Hero Section Skeleton */}
      <div className="relative py-16 text-center bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(66,103,255,0.8),transparent_70%)]" />
        
        <div className="relative z-10 max-w-4xl px-4 mx-auto">
          <div className="mx-auto mb-6 h-12 w-3/4 max-w-md bg-gray-700 animate-pulse rounded"></div>
          <div className="mx-auto mb-8 h-6 w-2/4 max-w-sm bg-gray-700 animate-pulse rounded"></div>
          
          <div className="relative max-w-xl mx-auto">
            <div className="w-full h-12 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="w-full h-10 bg-gray-700 animate-pulse rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="bg-gray-800 border border-gray-700 shadow-md">
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
          </div>
          
          {/* Cart Sidebar Skeleton */}
          <div className="w-full md:w-80 md:min-w-[320px]">
            <Card className="bg-gray-800 border border-gray-700 sticky top-24">
              <CardHeader className="bg-gradient-to-r from-blue-900/60 to-teal-900/60">
                <div className="w-3/4 h-6 bg-gray-700 animate-pulse"></div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-700 animate-pulse mb-3"></div>
                  <div className="mx-auto w-1/2 h-4 bg-gray-700 animate-pulse mb-2"></div>
                  <div className="mx-auto w-2/3 h-3 bg-gray-700 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}