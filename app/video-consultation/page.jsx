'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Phone,
  MessageSquare,
  MoreVertical,
  Users,
  MonitorSmartphone,
  Maximize2,
  Paperclip,
  Send,
  AlertCircle,
  X
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function VideoConsultation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  
  const [isCallActive, setIsCallActive] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [waitingInQueue, setWaitingInQueue] = useState(false)
  const [consultationEnded, setConsultationEnded] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [networkQuality, setNetworkQuality] = useState('good')
  // Add new state variables for permission handling
  const [permissionStatus, setPermissionStatus] = useState({
    camera: 'prompt',  // 'prompt', 'granted', 'denied'
    microphone: 'prompt'
  })
  const [permissionError, setPermissionError] = useState(null)
  
  const doctorId = searchParams.get('doctorId')
  const doctorName = searchParams.get('doctorName') || 'Dr. Unknown'
  const doctorSpecialty = searchParams.get('specialty') || 'Specialist'
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const timerRef = useRef(null)
  
  const doctor = {
    id: doctorId || '1',
    name: doctorName,
    specialty: doctorSpecialty,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=0D8ABC&color=fff&size=200`,
    experience: '10+ years'
  }
  
  // Helper functions for managing permissions
  const checkPermissions = async () => {
    try {
      // Check if permissions are already granted through the Permissions API
      if (navigator.permissions) {
        const cameraResult = await navigator.permissions.query({ name: 'camera' });
        const microphoneResult = await navigator.permissions.query({ name: 'microphone' });
        
        setPermissionStatus({
          camera: cameraResult.state,
          microphone: microphoneResult.state
        });
        
        // Add event listeners to track permission changes
        cameraResult.addEventListener('change', () => {
          setPermissionStatus(prev => ({ ...prev, camera: cameraResult.state }));
        });
        
        microphoneResult.addEventListener('change', () => {
          setPermissionStatus(prev => ({ ...prev, microphone: microphoneResult.state }));
        });
      }
    } catch (error) {
      console.log("Permissions API not supported or error:", error);
      // Continue with media request even if Permissions API fails
    }
  };
  
  const setupLocalVideo = async () => {
    // Clear any previous error
    setPermissionError(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError("Your browser doesn't support media devices. Please try a different browser.");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // If we got here, permissions were granted
      setPermissionStatus({
        camera: 'granted',
        microphone: 'granted'
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setTimeout(() => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }, 8000);
      
    } catch (error) {
      console.error("Error accessing media devices:", error);
      
      // Set appropriate error message based on error name
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionError("Camera or microphone access was denied. Please allow access to both camera and microphone to join the consultation.");
        
        // Update permission status
        setPermissionStatus({
          camera: 'denied',
          microphone: 'denied'
        });
      } else if (error.name === 'NotFoundError') {
        setPermissionError("Camera or microphone not found. Please check your device connections.");
      } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
        setPermissionError("Your camera or microphone is already in use by another application.");
      } else {
        setPermissionError("Error accessing your camera and microphone: " + error.message);
      }
      
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    }
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/video-consultation')
      return
    }
    
    const connectTimeout = setTimeout(() => {
      setConnectionStatus('waiting-for-doctor')
      setWaitingInQueue(true)
      
      const doctorJoinTimeout = setTimeout(() => {
        setConnectionStatus('connected')
        setIsCallActive(true)
        setWaitingInQueue(false)
        startTimer()
        
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now(),
            sender: 'doctor',
            text: `Hello, I'm ${doctor.name}. How can I help you today?`,
            timestamp: new Date().toISOString()
          }
        ])
      }, 8000)
      
      return () => clearTimeout(doctorJoinTimeout)
    }, 2000)
    
    return () => {
      clearTimeout(connectTimeout)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isAuthenticated, router, doctor.name])
  
  useEffect(() => {
    if (!isAuthenticated) return
    
    checkPermissions().then(() => setupLocalVideo());
    
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const tracks = remoteVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isAuthenticated]);
  
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }
  
  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }
  
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }
  
  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsCallActive(false)
    setConsultationEnded(true)
  }
  
  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    setTimeout(() => {
      const responses = [
        "I understand. Could you tell me more about your symptoms?",
        "How long have you been experiencing this issue?",
        "Have you taken any medication for this?",
        "I recommend we run some tests to confirm the diagnosis.",
        "Let me explain what might be causing this."
      ]
      
      const doctorMessage = {
        id: Date.now() + 1,
        sender: 'doctor',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, doctorMessage])
    }, 2000)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-12 text-center bg-gradient-to-r from-black via-gray-900 to-black"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(66,103,255,0.8),transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl px-4 mx-auto"
        >
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">Consultation</span>
          </h1>
          
          {!consultationEnded ? (
            <div className="flex items-center justify-center gap-2">
              <Badge className={`${isCallActive ? 'bg-green-600' : 'bg-amber-600'}`}>
                {isCallActive ? 'Call in Progress' : connectionStatus === 'connecting' ? 'Connecting...' : 'Waiting for Doctor'}
              </Badge>
              
              {isCallActive && (
                <Badge variant="outline" className="text-white border-blue-500/40">
                  Session Time: {formatTime(sessionTime)}
                </Badge>
              )}
              
              <Badge variant="outline" className={`
                ${networkQuality === 'good' ? 'text-green-400 border-green-500/40' : 
                  networkQuality === 'fair' ? 'text-amber-400 border-amber-500/40' : 
                  'text-red-400 border-red-500/40'}
              `}>
                Network: {networkQuality}
              </Badge>
            </div>
          ) : (
            <p className="text-xl text-gray-300">Your consultation has ended</p>
          )}
        </motion.div>
      </motion.section>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Display permission error message if any */}
        {permissionError && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/30 text-white">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertTitle className="text-red-300">Permission Error</AlertTitle>
            <AlertDescription className="mt-2">
              {permissionError}
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-950/50 mr-2"
                  onClick={() => {
                    // Try to request permissions again
                    setPermissionError(null);
                    checkPermissions().then(() => setupLocalVideo());
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    // Open browser settings to change permissions
                    window.open('about:settings', '_blank');
                  }}
                >
                  Open Browser Settings
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`flex-1 ${isChatOpen ? 'lg:w-2/3' : 'w-full'}`}>
            {waitingInQueue ? (
              <Card className="bg-gray-800 border-blue-500/20 shadow-lg text-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-900/40 to-transparent border-b border-gray-700 pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-blue-500/30">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback className="bg-blue-800">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <CardDescription className="text-blue-400">{doctor.specialty}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-col p-12">
                  <div className="w-24 h-24 rounded-full border-4 border-t-blue-500 border-blue-500/30 animate-spin mb-6"></div>
                  <h3 className="text-xl font-semibold mb-2">Waiting for Doctor</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    {doctor.name} will join the call shortly. Please ensure your camera and microphone are enabled.
                  </p>
                  <div className="mt-6">
                    <div className="flex gap-4 mt-4">
                      <Button
                        variant={isAudioEnabled ? "default" : "destructive"}
                        size="icon"
                        className={isAudioEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}
                        onClick={toggleAudio}
                      >
                        {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant={isVideoEnabled ? "default" : "destructive"} 
                        size="icon"
                        className={isVideoEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}
                        onClick={toggleVideo}
                      >
                        {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-950 hover:text-red-300"
                        onClick={() => router.push('/doctors')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : consultationEnded ? (
              <Card className="bg-gray-800 border-blue-500/20 shadow-lg text-white">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle>Consultation Summary</CardTitle>
                  <CardDescription>Your video consultation with {doctor.name} has ended</CardDescription>
                </CardHeader>
                <CardContent className="py-6 space-y-6">
                  <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">Thank you for using our video consultation service</h3>
                    <p className="text-gray-300 mb-6">
                      We hope your consultation was helpful. You can book a follow-up appointment or rate your experience below.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-blue-800"
                        onClick={() => router.push(`/doctors?doctorId=${doctor.id}`)}
                      >
                        Book Follow-up Appointment
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-900/20"
                        onClick={() => router.push('/doctors')}
                      >
                        Find Another Doctor
                      </Button>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-900/20 border-blue-500/20">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Your prescription details</AlertTitle>
                    <AlertDescription className="mt-2">
                      Your prescription (if any) will be available in your profile under Medical Records section within 2 hours.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ) : (
              <div className="relative h-[70vh] bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  ></video>
                  
                  <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-md text-white text-sm flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{doctor.name}</span>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Badge className="bg-black/60 border-0">
                      {formatTime(sessionTime)}
                    </Badge>
                  </div>
                </div>
                
                <div className="absolute right-4 bottom-16 w-48 h-36 rounded-lg overflow-hidden border-2 border-blue-600 shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  ></video>
                  <div className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded text-white text-xs">
                    You
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 py-4 px-6 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant={isAudioEnabled ? "outline" : "destructive"}
                      size="icon"
                      className={isAudioEnabled ? "border-gray-600 hover:bg-gray-700" : ""}
                      onClick={toggleAudio}
                    >
                      {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      variant={isVideoEnabled ? "outline" : "destructive"}
                      size="icon"
                      className={isVideoEnabled ? "border-gray-600 hover:bg-gray-700" : ""}
                      onClick={toggleVideo}
                    >
                      {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-700 hover:bg-red-800"
                      onClick={endCall}
                    >
                      <Phone className="h-5 w-5 rotate-[135deg]" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className={isChatOpen ? "border-blue-500 text-blue-500" : "border-gray-600 hover:bg-gray-700"}
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-700">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="focus:bg-gray-700">
                          <MonitorSmartphone className="mr-2 h-4 w-4" />
                          <span>Share Screen</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-700">
                          <Maximize2 className="mr-2 h-4 w-4" />
                          <span>Full Screen</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-700">
                          <Paperclip className="mr-2 h-4 w-4" />
                          <span>Share Files</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {isChatOpen && isCallActive && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="w-full lg:w-1/3 h-[70vh]"
            >
              <Card className="h-full bg-gray-800 border-gray-700 text-white overflow-hidden flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-900/40 to-transparent border-b border-gray-700 p-4 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Chat with Doctor</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsChatOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation with your doctor</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.sender === 'user' 
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-white'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-700 p-4 flex-shrink-0">
                  <form 
                    className="flex w-full gap-2" 
                    onSubmit={(e) => {
                      e.preventDefault()
                      sendMessage()
                    }}
                  >
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      type="submit"
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
        
        {!consultationEnded && (
          <Card className="mt-6 bg-gray-800 border-gray-700 text-white">
            <CardHeader className="border-b border-gray-700 pb-3">
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-blue-500/30">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback className="bg-blue-800">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-blue-400">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="md:ml-auto flex gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{sessionTime > 0 ? formatTime(sessionTime) : '--:--'}</div>
                    <div className="text-xs text-gray-400">Session Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}