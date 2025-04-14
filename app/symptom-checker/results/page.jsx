import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, MapPin, Phone, Star, User } from "lucide-react"

// Mock data - would be replaced with API data in a real application
const conditions = [
  {
    id: 1,
    name: "Migraine",
    confidence: 85,
    description: "A neurological condition characterized by recurrent headaches that are moderate to severe.",
    symptoms: ["Throbbing headache", "Sensitivity to light", "Nausea"],
    recommendations: ["Rest in a dark, quiet room", "Stay hydrated", "Consider over-the-counter pain relievers"],
  },
  {
    id: 2,
    name: "Tension Headache",
    confidence: 65,
    description: "The most common type of headache that causes mild to moderate pain.",
    symptoms: ["Dull, aching head pain", "Tightness around forehead", "Tenderness in scalp"],
    recommendations: [
      "Practice stress management",
      "Apply a warm compress",
      "Consider over-the-counter pain relievers",
    ],
  },
  {
    id: 3,
    name: "Sinusitis",
    confidence: 45,
    description: "Inflammation of the sinuses, often caused by infection.",
    symptoms: ["Facial pain/pressure", "Nasal congestion", "Headache"],
    recommendations: ["Use a humidifier", "Apply warm compresses", "Consider over-the-counter decongestants"],
  },
]

const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    experience: "15 years",
    rating: 4.8,
    location: "Apollo Hospital, Delhi",
    distance: "3.2 km",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "12 years",
    rating: 4.6,
    location: "Max Healthcare, Delhi",
    distance: "5.1 km",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Dr. Ananya Patel",
    specialty: "ENT Specialist",
    experience: "10 years",
    rating: 4.7,
    location: "Fortis Hospital, Delhi",
    distance: "4.5 km",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function ResultsPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-teal-700">Diagnosis Results</h1>
        <p className="mt-2 text-gray-500">
          Based on your symptoms, here are the potential conditions and recommended specialists
        </p>
      </div>

      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="firstaid">First Aid</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="mt-6">
          <div className="grid gap-6">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  This is an AI-generated diagnosis and should not replace professional medical advice. Please consult
                  with a healthcare provider for proper evaluation.
                </p>
              </div>
            </div>

            {conditions.map((condition) => (
              <Card key={condition.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{condition.name}</span>
                    <span className="text-sm font-normal text-gray-500">Confidence: {condition.confidence}%</span>
                  </CardTitle>
                  <CardDescription>{condition.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Confidence Level</h4>
                    <Progress value={condition.confidence} className="h-2 w-full" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Common Symptoms</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                      {condition.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Recommendations</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                      {condition.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Find Specialists for {condition.name}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <div className="grid gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-shrink-0">
                      <img
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-teal-600" />
                          <span className="text-sm">{doctor.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{doctor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <span className="text-sm">
                          {doctor.location} ({doctor.distance})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="firstaid" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>First Aid for Headache</CardTitle>
              <CardDescription>Follow these steps to manage your symptoms before seeing a doctor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Immediate Steps</h4>
                <ol className="list-inside list-decimal space-y-2 text-sm text-gray-500">
                  <li>Find a quiet, dark room to rest</li>
                  <li>Apply a cold or warm compress to your head or neck</li>
                  <li>Take over-the-counter pain relievers as directed</li>
                  <li>Stay hydrated by drinking water</li>
                </ol>
              </div>
              <div>
                <h4 className="mb-2 font-medium">When to Seek Emergency Care</h4>
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-500">
                  <li>Sudden, severe headache that feels like the "worst headache of your life"</li>
                  <li>
                    Headache accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness or
                    difficulty speaking
                  </li>
                  <li>Headache after a head injury</li>
                  <li>Chronic headache that worsens after coughing, exertion, straining or sudden movement</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Detailed First Aid Guide
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center">
        <Link href="/symptom-checker">
          <Button variant="outline">Start New Diagnosis</Button>
        </Link>
      </div>
    </div>
  )
}

