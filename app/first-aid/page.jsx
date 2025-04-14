import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for first aid guides
const firstAidGuides = [
  {
    id: "cuts",
    title: "Cuts and Scrapes",
    description: "How to treat minor cuts and scrapes",
    steps: [
      "Clean your hands with soap and water",
      "Stop the bleeding by applying gentle pressure with a clean cloth or bandage",
      "Clean the wound with clean water. Avoid using soap on the wound itself",
      "Apply an antibiotic ointment to prevent infection",
      "Cover the wound with a sterile bandage",
      "Change the dressing at least once a day or whenever it gets wet or dirty",
    ],
    warning:
      "Seek medical attention if the cut is deep, bleeding heavily, or shows signs of infection (redness, swelling, warmth, or pus).",
  },
  {
    id: "burns",
    title: "Minor Burns",
    description: "First aid for first-degree and small second-degree burns",
    steps: [
      "Cool the burn by holding it under cool (not cold) running water for 10 to 15 minutes",
      "Don't apply ice directly to the burn as it can damage the tissue",
      "Apply a gentle moisturizer or aloe vera gel to the area",
      "Take an over-the-counter pain reliever if needed",
      "Cover the burn with a sterile, non-stick bandage",
      "Don't break blisters as this increases the risk of infection",
    ],
    warning:
      "Seek medical attention for burns that are larger than 3 inches in diameter, on the face, hands, feet, genitals, or major joints, or if the burn appears white, charred, or leathery.",
  },
  {
    id: "sprains",
    title: "Sprains and Strains",
    description: "How to manage joint and muscle injuries",
    steps: [
      "Rest the injured area to prevent further damage",
      "Apply ice wrapped in a thin cloth for 20 minutes several times a day",
      "Compress the area with an elastic bandage to reduce swelling",
      "Elevate the injured limb above the level of your heart when possible",
      "Take over-the-counter pain relievers as needed",
      "After 48 hours, gentle heat can be applied to increase blood flow and healing",
    ],
    warning:
      "Seek medical attention if you cannot bear weight on the injured joint, if there is significant swelling or bruising, or if the pain is severe.",
  },
  {
    id: "choking",
    title: "Choking",
    description: "Emergency steps for choking victims",
    steps: [
      "Encourage the person to cough forcefully if they can",
      "If the person cannot cough, speak, or breathe, stand behind them and wrap your arms around their waist",
      "Make a fist with one hand and place it just above the person's navel",
      "Grasp your fist with your other hand and press hard into the abdomen with a quick, upward thrust",
      "Repeat thrusts until the object is expelled or the person becomes unconscious",
      "If the person becomes unconscious, lower them to the ground and begin CPR if trained",
    ],
    warning: "Call emergency services (112) immediately for any choking incident, even if the obstruction is removed.",
  },
  {
    id: "headache",
    title: "Headache",
    description: "Managing different types of headaches",
    steps: [
      "Rest in a quiet, dark room",
      "Apply a cold or warm compress to your head or neck",
      "Take over-the-counter pain relievers as directed",
      "Stay hydrated by drinking water",
      "Practice relaxation techniques such as deep breathing or meditation",
      "Massage your temples, neck, and scalp to relieve tension",
    ],
    warning:
      "Seek immediate medical attention for sudden, severe headaches, headaches accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness, or difficulty speaking.",
  },
  {
    id: "fever",
    title: "Fever",
    description: "How to manage and reduce fever",
    steps: [
      "Rest and drink plenty of fluids to prevent dehydration",
      "Take over-the-counter fever reducers like acetaminophen or ibuprofen as directed",
      "Dress in lightweight clothing and use a light blanket if you feel cold",
      "Take a lukewarm bath or apply a cool, damp washcloth to your forehead",
      "Monitor your temperature regularly",
      "Avoid alcohol and caffeine as they can contribute to dehydration",
    ],
    warning:
      "Seek medical attention for fevers above 103°F (39.4°C), fevers lasting more than three days, or if accompanied by severe headache, stiff neck, confusion, or difficulty breathing.",
  },
]

export default function FirstAidPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-white to-blue-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            First Aid Guide
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mt-4 shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
          <p className="mt-4 text-gray-300">Quick reference for common medical emergencies and conditions</p>
        </div>

        <div className="relative mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-4 rounded-xl 
          border border-gray-700 hover:border-teal-500/50 transition-all duration-300">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-400" />
          <Input 
            placeholder="Search for first aid instructions..." 
            className="pl-10 bg-gray-700/50 border-gray-600 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="grid gap-8">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-xl 
            border border-gray-700 hover:border-teal-500/50 transition-all duration-300 
            hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
              Emergency Contacts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-700/50 border border-red-500/30 p-6 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300">
                <h3 className="font-bold text-red-400">Emergency Services</h3>
                <p className="text-3xl font-bold text-white mt-2">112</p>
                <p className="text-sm text-gray-400 mt-1">For life-threatening emergencies</p>
              </div>
              <div className="rounded-lg bg-gray-700/50 border border-teal-500/30 p-6 hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all duration-300">
                <h3 className="font-bold text-teal-400">Poison Control</h3>
                <p className="text-3xl font-bold text-white mt-2">1800-222-1222</p>
                <p className="text-sm text-gray-400 mt-1">For poison emergencies</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-xl 
            border border-gray-700 hover:border-teal-500/50 transition-all duration-300 
            hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
              Common First Aid Procedures
            </h2>
            <p className="text-gray-300 mb-6">Step-by-step guides for handling common injuries and conditions</p>
            
            <Accordion type="single" collapsible className="w-full">
              {firstAidGuides.map((guide) => (
                <AccordionItem key={guide.id} value={guide.id} className="border-gray-700">
                  <AccordionTrigger className="text-left text-white hover:text-teal-400 transition-colors py-4">
                    <div>
                      <h3 className="font-medium">{guide.title}</h3>
                      <p className="text-sm text-gray-400">{guide.description}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-gray-300">
                    <div>
                      <h4 className="mb-2 font-medium text-teal-400">Steps</h4>
                      <ol className="list-inside list-decimal space-y-2">
                        {guide.steps.map((step, index) => (
                          <li key={index} className="text-gray-300">{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="rounded-lg border border-yellow-500/20 bg-gray-800/80 p-4">
                      <h4 className="mb-1 font-medium text-yellow-400">Warning</h4>
                      <p className="text-gray-300">{guide.warning}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

