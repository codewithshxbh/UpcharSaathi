'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  MapPin,
  Building,
  Home,
  Plus,
  Trash2,
  Save,
  ShieldCheck,
  ShoppingBag,
  FileText,
} from 'lucide-react'

// Order Card component for displaying order history
function OrderCard({ orderId, date, status, items, total }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">Order #{orderId}</h3>
          <p className="text-gray-400 text-sm">
            Ordered on {new Date(date).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div>
          {status === 'delivered' ? (
            <Badge className="bg-green-800 text-green-200">Delivered</Badge>
          ) : status === 'processing' ? (
            <Badge className="bg-blue-800 text-blue-200">Processing</Badge>
          ) : (
            <Badge className="bg-red-800 text-red-200">Cancelled</Badge>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm text-gray-400 mb-2">Items</h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity} × {item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
          <strong>Total</strong>
          <strong>₹{total}</strong>
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm"
          className="border-gray-600 text-sm"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

// Disease Record component for displaying disease information
function DiseaseRecord({ record, onDelete }) {
  const formattedDate = new Date(record.timestamp).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{record.disease}</h3>
            {record.confidence && (
              <span className="ml-2 bg-blue-800 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                {Math.round(record.confidence * 100)}% match
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">Detected: {formattedDate}</p>
        </div>
        {onDelete && (
          <button 
            className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-gray-700/50"
            onClick={() => onDelete(record.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {record.symptoms && record.symptoms.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm text-gray-400 mb-1">Reported symptoms:</h4>
          <div className="flex flex-wrap gap-2">
            {record.symptoms.map((symptom, index) => (
              <span key={index} className="border border-gray-600 text-xs rounded px-2 py-0.5">
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {record.description && (
        <p className="mt-2 text-sm">{record.description}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, user, getMedicalRecords, deleteMedicalRecord } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  
    // State declarations - keeping all useState hooks together at the top
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [medicalRecords, setMedicalRecords] = useState([])
  const [editingAddressIndex, setEditingAddressIndex] = useState(null)
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    appointments: true,
    promotional: false
  })
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    verificationCode: "",
    twoFactorEnabled: false
  })
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [marketingCommunications, setMarketingCommunications] = useState(false)
  const [shareHealthData, setShareHealthData] = useState(false)
  const [measurementSystem, setMeasurementSystem] = useState('metric')
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    dob: '1990-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 9876543211',
    allergies: 'None',
    height: '175',
    weight: '70',
  })
  const [addresses, setAddresses] = useState([
    {
      id: 'home',
      type: 'Home',
      name: 'Rahul Sharma',
      address: '123 Palm Grove, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      phone: '+91 9876543210',
      isDefault: true,
    },
    {
      id: 'work',
      type: 'Work',
      name: 'Rahul Sharma',
      address: 'ABC Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 9876543210',
      isDefault: false,
    },
  ])
  const [addressForm, setAddressForm] = useState({
    id: "",
    type: "Home",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false
  })
  const [orders, setOrders] = useState([
    {
      orderId: "ORD12345",
      date: "2025-04-01",
      status: "delivered",
      items: [
        { name: "Paracetamol 500mg", quantity: 2, price: 120 },
        { name: "Vitamin C", quantity: 1, price: 250 }
      ],
      total: 490
    },
    {
      orderId: "ORD12346",
      date: "2025-03-25",
      status: "processing",
      items: [
        { name: "Blood Pressure Monitor", quantity: 1, price: 2000 },
        { name: "Bandages", quantity: 2, price: 150 }
      ],
      total: 2300
    },
    {
      orderId: "ORD12347",
      date: "2025-03-15",
      status: "delivered",
      items: [
        { name: "Omeprazole", quantity: 1, price: 180 },
        { name: "Crocin", quantity: 3, price: 45 }
      ],
      total: 315
    }
  ])
  const [appointments, setAppointments] = useState([
    {
      id: "appt-001",
      doctorName: "Dr. Anjali Gupta",
      specialization: "Cardiologist",
      date: "2025-04-15",
      time: "10:30",
      hospital: "Max Super Speciality Hospital",
      status: "upcoming",
      notes: "Regular heart checkup"
    },
    {
      id: "appt-002",
      doctorName: "Dr. Vikram Patel",
      specialization: "Dermatologist",
      date: "2025-04-20",
      time: "15:00",
      hospital: "Apollo Hospitals",
      status: "upcoming",
      notes: "Follow-up on skin condition"
    },
    {
      id: "appt-003",
      doctorName: "Dr. Rajesh Kumar",
      specialization: "General Physician",
      date: "2025-03-25",
      time: "11:15",
      hospital: "Fortis Hospital",
      status: "completed",
      notes: "Annual health check-up"
    }
  ])
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    appointments: true,
    promotions: false,
    medicineReminders: true,
    healthTips: false,
    orderUpdates: true
  })
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false
  })
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    profileVisibility: "private",
    locationAccess: false,
    cookiePreferences: {
      necessary: true,
      analytics: true,
      marketing: false
    }
  })

  // useEffect hooks
  useEffect(() => {
    if (user) {
      const records = getMedicalRecords() || [];
      setMedicalRecords(records);
    }
  }, [user, getMedicalRecords]);

  useEffect(() => {
    if (tabFromUrl && ['personal', 'addresses', 'orders', 'medical', 'appointments', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile')
    }
  }, [isAuthenticated, router])

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null
  }

  // Function to handle deleting a medical record
  const handleDeleteRecord = (recordId) => {
    if (!recordId) return;
    
    // Call the deleteMedicalRecord function from AuthContext
    deleteMedicalRecord(recordId);
    
    // Update UI by filtering out the deleted record
    setMedicalRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
  }

  // Filter records by type
  const getFilteredRecords = (type) => {
    return medicalRecords.filter(record => record.type === type);
  };

  // Get disease records (from symptom checker)
  const getDiseaseRecords = () => {
    return medicalRecords.filter(record => record.recordType === 'disease');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // Here you would call an API to update the user's profile
    // For now, we'll just toggle editing mode
    setIsEditing(false)
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData.name) {
      return profileData.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    return 'US'
  }

  // State for uploaded files
  // Handle file upload - updated with better handling
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to Array to handle multiple files
      Array.from(files).forEach(file => {
        const newFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          date: new Date().toLocaleDateString("en-IN"),
          file: file // Store the actual file object
        };
        setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
      });
    }
    // Reset the input to allow selecting the same file again
    e.target.value = null;
  };

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle file delete
  const handleDeleteFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Preview file handler
  const handlePreviewFile = (file) => {
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(file.file);
    window.open(fileUrl, '_blank');
    // Clean up object URL after preview
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
  };

  // Sample orders for the orders tab
  // Address form state

  // Reset address form to defaults
  const resetAddressForm = () => {
    setAddressForm({
      id: "",
      type: "Home",
      name: profileData.name,
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: profileData.phone,
      isDefault: false
    });
  };

  // Handle address form input change
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle add address submission
  const handleAddressSubmit = () => {
    const newAddress = {
      ...addressForm,
      id: addressForm.id || Math.random().toString(36).substring(2, 9)
    };
    
    // Update existing address
    if (editingAddressIndex !== null) {
      handleUpdateAddress(editingAddressIndex, newAddress);
    } 
    // Add new address
    else {
      // If this is the first address or isDefault is checked, make it default
      if (addresses.length === 0 || newAddress.isDefault) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
        newAddress.isDefault = true;
      }
      setAddresses((prev) => [...prev, newAddress]);
      setShowAddAddressForm(false);
    }
    resetAddressForm();
    setEditingAddressIndex(null);
  };

  // Handle edit address
  const handleEditAddress = (index) => {
    setAddressForm(addresses[index]);
    setEditingAddressIndex(index);
    setShowAddAddressForm(true);
  };

  // Cancel address form
  const handleCancelAddressForm = () => {
    setShowAddAddressForm(false);
    setEditingAddressIndex(null);
    resetAddressForm();
  };

  // Sample appointments for appointments tab

  // Function to cancel appointment
  const handleCancelAppointment = (appointmentId) => {
    // In a real app, you'd make an API call here
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: "cancelled" } 
          : appointment
      )
    );
  };

  // Function to reschedule appointment
  const handleRescheduleAppointment = (appointmentId) => {
    // In a real app, you'd open a form or modal to select a new date/time
    alert(`Reschedule functionality would open a date/time picker for appointment ${appointmentId}`);
  };

  // Enhanced notification settings with more options

  // Handle notification preference change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle saving notification preferences
  const handleSaveNotifications = () => {
    // Here you would call an API to save notification preferences
    alert("Notification preferences saved successfully!");
  };

  // Security settings state

  // Handle security form changes
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle password change submission
  const handleChangePassword = () => {
    // Validate passwords
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    
    if (securitySettings.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    
    // API call would happen here
    alert("Password updated successfully!");
    
    // Reset form
    setSecuritySettings(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  // Toggle two-factor authentication
  const handleToggle2FA = () => {
    setSecuritySettings(prev => ({
      ...prev, 
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    
    // API call would happen here
    alert(securitySettings.twoFactorEnabled ? 
      "Two-factor authentication disabled" : 
      "Two-factor authentication enabled");
  };

  // Enhanced privacy settings

  // Handle privacy setting changes
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle cookie preference changes
  const handleCookiePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings((prev) => ({
      ...prev,
      cookiePreferences: {
        ...prev.cookiePreferences,
        [name]: checked
      }
    }));
  };

  // Handle cookie preferences dialog
  const handleCookiePreferences = () => {
    // In a real app, this would open a modal or dialog to manage cookie preferences
    alert("Cookie preferences management would open a dialog here.");
  };

  // Save privacy settings
  const handleSavePrivacySettings = () => {
    // API call would happen here
    alert("Privacy settings updated successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="col-span-1">
              <Card className="bg-gray-800 border-gray-700 text-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-teal-900 p-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder-user.jpg" alt="User profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-600 text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="mt-4 text-xl font-semibold text-center">{profileData.name}</h2>
                  <p className="text-gray-300 text-sm text-center">{profileData.email}</p>
                  
                  <div className="mt-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/40 text-blue-300">
                      <Calendar className="w-3 h-3 mr-1" />
                      Joined April 2025
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700/50 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>{profileData.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700/50 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-teal-400" />
                    </div>
                    <span>Born {new Date(profileData.dob).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700/50 p-2 rounded-full">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span>Blood Group: <span className="text-white font-medium">{profileData.bloodGroup}</span></span>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="font-medium mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant="outline" 
                        className="border-gray-600 hover:bg-gray-700 justify-start"
                        onClick={() => router.push('/doctors')}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 hover:bg-gray-700 justify-start"
                        onClick={() => router.push('/medicines')}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Order Medicines
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 hover:bg-gray-700 justify-start"
                        onClick={() => setActiveTab('medical')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Records
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-2 md:grid-cols-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="medical">Medical Records</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Personal Details Tab */}
                <TabsContent value="personal" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage your personal details and medical information
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                              id="dob"
                              name="dob"
                              type="date"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.dob}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                              id="gender"
                              name="gender"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.gender}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            <Input
                              id="bloodGroup"
                              name="bloodGroup"
                              className="bg-gray-700 border-gray-600"
                              value={profileData.bloodGroup}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                          <h3 className="text-lg font-medium mb-4">Medical Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="height">Height (cm)</Label>
                              <Input
                                id="height"
                                name="height"
                                type="number"
                                className="bg-gray-700 border-gray-600"
                                value={profileData.height}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="weight">Weight (kg)</Label>
                              <Input
                                id="weight"
                                name="weight"
                                type="number"
                                className="bg-gray-700 border-gray-600"
                                value={profileData.weight}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="emergencyContact">Emergency Contact</Label>
                              <Input
                                id="emergencyContact"
                                name="emergencyContact"
                                className="bg-gray-700 border-gray-600"
                                value={profileData.emergencyContact}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="allergies">Allergies</Label>
                              <Textarea
                                id="allergies"
                                name="allergies"
                                className="bg-gray-700 border-gray-600 min-h-[100px]"
                                value={profileData.allergies}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="List any allergies or 'None'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {isEditing && (
                      <CardFooter className="flex justify-end space-x-4 border-t border-gray-700 pt-4">
                        <Button 
                          variant="outline" 
                          className="border-gray-600" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                          onClick={handleSaveProfile}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </TabsContent>

                {/* Address Book Tab */}
                <TabsContent value="addresses" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Address Book</CardTitle>
                          <CardDescription className="text-gray-400">
                            Manage your delivery addresses
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Address
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div 
                            key={address.id} 
                            className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-700/50 transition"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                {address.type === 'Home' ? (
                                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                                ) : (
                                  <Building className="h-5 w-5 text-purple-400 mr-3" />
                                )}
                                <div>
                                  <h3 className="font-medium text-lg">{address.type}</h3>
                                  {address.isDefault && (
                                    <Badge className="bg-blue-800 text-blue-200 mt-1">Default</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 space-y-1 text-gray-300">
                              <p>{address.name}</p>
                              <p>{address.address}</p>
                              <p>{address.city}, {address.state} {address.pincode}</p>
                              <p className="pt-1">Phone: {address.phone}</p>
                            </div>
                            {!address.isDefault && (
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-gray-600 text-sm"
                                >
                                  Make Default
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Order History Tab */}
                <TabsContent value="orders" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription className="text-gray-400">
                        View and track your medicine orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-4">Showing your recent orders</p>
                      <div className="space-y-4">
                        {/* This would be populated from an API in a real app */}
                        <OrderCard 
                          orderId="ORD123456"
                          date="2025-04-05"
                          status="delivered"
                          items={[
                            { name: "Paracetamol", quantity: 2, price: 120 },
                            { name: "Vitamin D3", quantity: 1, price: 350 }
                          ]}
                          total={590}
                        />
                        <OrderCard 
                          orderId="ORD123400"
                          date="2025-03-22"
                          status="delivered"
                          items={[
                            { name: "Cetirizine", quantity: 1, price: 85 },
                            { name: "Multivitamin", quantity: 1, price: 450 }
                          ]}
                          total={535}
                        />
                        <OrderCard 
                          orderId="ORD122456"
                          date="2025-03-10"
                          status="cancelled"
                          items={[
                            { name: "Insulin Glargine", quantity: 1, price: 1200 }
                          ]}
                          total={1200}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Medical Records Tab */}
                <TabsContent value="medical" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Medical Records</CardTitle>
                          <CardDescription className="text-gray-400">
                            Your health records and history
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline"
                          className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                          onClick={() => document.getElementById('file-upload').click()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Record
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="records" className="w-full">
                        <TabsList className="bg-gray-700 grid w-full grid-cols-3">
                          <TabsTrigger value="records">Documents</TabsTrigger>
                          <TabsTrigger value="conditions">Conditions</TabsTrigger>
                          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="records" className="mt-4 space-y-4">
                          {uploadedFiles.length > 0 ? (
                            uploadedFiles.map((file, index) => (
                              <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{file.name}</h3>
                                    <p className="text-gray-400 text-sm">Uploaded on {file.date}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" className="border-gray-600">
                                      View
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-400 hover:text-red-300"
                                      onClick={() => handleDeleteFile(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : null}
                          
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Blood Test Report</h3>
                                <p className="text-gray-400 text-sm">Uploaded on Apr 02, 2025</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-gray-600">
                                View
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">X-Ray Report</h3>
                                <p className="text-gray-400 text-sm">Uploaded on Mar 15, 2025</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-gray-600">
                                View
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">COVID-19 Vaccination Certificate</h3>
                                <p className="text-gray-400 text-sm">Uploaded on Jan 10, 2025</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-gray-600">
                                View
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="conditions" className="mt-4">
                          <div className="space-y-4">
                            {/* Show disease records from symptom checker */}
                            {getDiseaseRecords().length > 0 ? (
                              getDiseaseRecords().map((record) => (
                                <DiseaseRecord 
                                  key={record.id} 
                                  record={record}
                                  onDelete={handleDeleteRecord} 
                                />
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-400">
                                <p>No disease records found.</p>
                                <p className="mt-2 text-sm">
                                  Use the Symptom Checker to detect possible conditions.
                                </p>
                                <Button
                                  className="mt-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                  onClick={() => router.push('/symptom-checker')}
                                >
                                  Go to Symptom Checker
                                </Button>
                              </div>
                            )}
                            
                            {/* Static sample conditions - keep these as examples */}
                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                              <h3 className="font-medium">Asthma</h3>
                              <p className="text-gray-400 text-sm">Diagnosed: 2020</p>
                              <p className="mt-2">Mild persistent asthma, controlled with medication</p>
                            </div>
                            
                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                              <h3 className="font-medium">Seasonal Allergies</h3>
                              <p className="text-gray-400 text-sm">Diagnosed: 2018</p>
                              <p className="mt-2">Pollen and dust allergy</p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="prescriptions" className="mt-4">
                          <div className="space-y-4">
                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">Dr. Ajay Kumar</h3>
                                  <p className="text-gray-400 text-sm">Prescribed on Mar 28, 2025</p>
                                  <div className="mt-2 space-y-1">
                                    <p>• Montelukast 10mg - 1 tablet daily</p>
                                    <p>• Fluticasone Inhaler - 2 puffs twice daily</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-gray-600">
                                  View
                                </Button>
                              </div>
                            </div>
                            
                            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">Dr. Priya Sharma</h3>
                                  <p className="text-gray-400 text-sm">Prescribed on Feb 12, 2025</p>
                                  <div className="mt-2 space-y-1">
                                    <p>• Cetirizine 10mg - 1 tablet daily</p>
                                    <p>• Multivitamin - 1 tablet daily</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-gray-600">
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>My Appointments</CardTitle>
                          <CardDescription className="text-gray-400">
                            Manage your doctor appointments
                          </CardDescription>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                          onClick={() => router.push('/doctors')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Book New Appointment
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="bg-gray-700 grid w-full grid-cols-2">
                          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                          <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="upcoming" className="mt-4 space-y-4">
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Dr. Rajesh Patel</h3>
                                <p className="text-sm text-gray-400">Cardiologist</p>
                                <div className="mt-2">
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                                    April 15, 2025 at 10:30 AM
                                  </p>
                                  <p className="flex items-center mt-1">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                                    City Hospital, Koramangala
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Badge className="bg-blue-800 text-blue-200">Confirmed</Badge>
                                <div className="flex flex-col space-y-2">
                                  <Button variant="outline" size="sm" className="border-gray-600">
                                    Reschedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="border-red-800 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="past" className="mt-4 space-y-4">
                          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Dr. Priya Sharma</h3>
                                <p className="text-sm text-gray-400">General Physician</p>
                                <div className="mt-2">
                                  <p className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                                    March 22, 2025 at 4:00 PM
                                  </p>
                                  <p className="flex items-center mt-1">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                                    HealthCare Clinic, Indiranagar
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Badge className="bg-green-800 text-green-200">Completed</Badge>
                                <Button variant="outline" size="sm" className="border-gray-600">
                                  View Summary
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700 text-white shadow-lg">
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your account preferences and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="notifications" className="w-full">
                        <TabsList className="bg-gray-700 grid w-full grid-cols-3">
                          <TabsTrigger value="notifications">Notifications</TabsTrigger>
                          <TabsTrigger value="security">Security</TabsTrigger>
                          <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="notifications" className="mt-4">
                          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-gray-400">Receive updates about appointments and orders</p>
                              </div>
                              <Switch
                                checked={notifications.email}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({...prev, email: checked}))
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">SMS Notifications</h4>
                                <p className="text-sm text-gray-400">Receive text messages for important updates</p>
                              </div>
                              <Switch
                                checked={notifications.sms}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({...prev, sms: checked}))
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Appointment Reminders</h4>
                                <p className="text-sm text-gray-400">Get reminders before your scheduled appointments</p>
                              </div>
                              <Switch
                                checked={notifications.appointments}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({...prev, appointments: checked}))
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Promotional Emails</h4>
                                <p className="text-sm text-gray-400">Receive offers and promotional content</p>
                              </div>
                              <Switch
                                checked={notifications.promotional}
                                onCheckedChange={(checked) => 
                                  setNotifications(prev => ({...prev, promotional: checked}))
                                }
                              />
                            </div>
                            
                            <div className="pt-4">
                              <Button 
                                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                onClick={handleSaveNotifications}
                              >
                                Save Preferences
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="security" className="mt-4">
                          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-medium mb-2">Change Password</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="current-password">Current Password</Label>
                                  <Input 
                                    id="current-password" 
                                    type="password" 
                                    className="bg-gray-700 border-gray-600 text-white"
                                    value={securityInfo.currentPassword}
                                    onChange={(e) => setSecurityInfo({...securityInfo, currentPassword: e.target.value})}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="new-password">New Password</Label>
                                  <Input 
                                    id="new-password" 
                                    type="password" 
                                    className="bg-gray-700 border-gray-600 text-white"
                                    value={securityInfo.newPassword}
                                    onChange={(e) => setSecurityInfo({...securityInfo, newPassword: e.target.value})}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                                  <Input 
                                    id="confirm-password" 
                                    type="password" 
                                    className="bg-gray-700 border-gray-600 text-white"
                                    value={securityInfo.confirmPassword}
                                    onChange={(e) => setSecurityInfo({...securityInfo, confirmPassword: e.target.value})}
                                  />
                                </div>
                                
                                <Button 
                                  className="mt-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                  onClick={handleChangePassword}
                                >
                                  Update Password
                                </Button>
                              </div>
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div>
                              <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-400 mb-3">
                                Add an extra layer of security to your account
                              </p>
                              
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h5 className="font-medium">Two-Factor Authentication</h5>
                                  <p className="text-sm text-gray-400">Secure your account with 2FA</p>
                                </div>
                                <Switch
                                  checked={securityInfo.twoFactorEnabled}
                                  onCheckedChange={(checked) => 
                                    setSecurityInfo(prev => ({...prev, twoFactorEnabled: checked}))
                                  }
                                />
                              </div>
                              
                              {securityInfo.twoFactorEnabled && (
                                <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 space-y-4">
                                  <div className="flex flex-col items-center space-y-3">
                                    <div className="border-4 border-gray-700 rounded-lg p-2 bg-white">
                                      {/* This would be a QR code in a real app */}
                                      <div className="h-40 w-40 grid grid-cols-5 grid-rows-5 gap-1">
                                        {Array(25).fill(0).map((_, i) => (
                                          <div 
                                            key={i} 
                                            className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-400 text-center">
                                      Scan this QR code with your authenticator app
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="verification-code">Verification Code</Label>
                                    <Input 
                                      id="verification-code" 
                                      className="bg-gray-700 border-gray-600 text-white"
                                      placeholder="Enter code from authenticator app"
                                      value={securityInfo.verificationCode}
                                      onChange={(e) => setSecurityInfo({...securityInfo, verificationCode: e.target.value})}
                                    />
                                  </div>
                                  
                                  <Button 
                                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                    onClick={handleVerify2FA}
                                  >
                                    Verify & Enable
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <Separator className="bg-gray-700" />
                            
                            <div>
                              <h4 className="font-medium mb-2">Account Activity</h4>
                              <div className="space-y-3">
                                <div className="border border-gray-700 rounded-lg p-3 bg-gray-800/50">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="text-sm">Login from Windows Device</p>
                                      <p className="text-xs text-gray-400">April 10, 2025 - 14:23</p>
                                    </div>
                                    <Badge className="bg-green-600">Current</Badge>
                                  </div>
                                </div>
                                
                                <div className="border border-gray-700 rounded-lg p-3 bg-gray-800/50">
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="text-sm">Login from Android Device</p>
                                      <p className="text-xs text-gray-400">April 8, 2025 - 09:15</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="privacy" className="mt-4">
                          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Profile Visibility</h4>
                                <p className="text-sm text-gray-400">Control who can see your profile information</p>
                              </div>
                              <Select
                                value={privacySettings.profileVisibility}
                                onValueChange={(value) => 
                                  setPrivacySettings(prev => ({...prev, profileVisibility: value}))
                                }
                              >
                                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="public">Public</SelectItem>
                                  <SelectItem value="private">Private</SelectItem>
                                  <SelectItem value="doctors">Doctors Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Data Usage</h4>
                                <p className="text-sm text-gray-400">Allow us to use your data for service improvement</p>
                              </div>
                              <Switch
                                checked={privacySettings.dataUsage}
                                onCheckedChange={(checked) => 
                                  setPrivacySettings(prev => ({...prev, dataUsage: checked}))
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Cookie Preferences</h4>
                                <p className="text-sm text-gray-400">Manage cookie settings for this site</p>
                              </div>
                              <Button variant="outline" className="border-gray-600" onClick={handleCookiePreferences}>
                                Manage
                              </Button>
                            </div>
                            
                            <div className="pt-4">
                              <Button 
                                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                                onClick={handleSavePrivacySettings}
                              >
                                Save Settings
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}