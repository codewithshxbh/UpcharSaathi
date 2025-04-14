'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, Settings, ShoppingBag, FileText, Calendar, LogOut, Bell, Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, logout, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Navigation links array for reuse
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/medicines', label: 'Medicines' },
    { href: '/symptom-checker', label: 'Symptom Checker' },
    { href: '/first-aid', label: 'First Aid' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' }
  ]
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user && user.name) {
      return user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    return 'US'
  }

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white hover:text-teal-400 transition-colors duration-300">UpcharSaathi</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'border-teal-400 text-white scale-105'
                      : 'border-transparent text-gray-400 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 hover:scale-105`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden mr-2 text-gray-300 hover:text-white hover:bg-gray-800">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-gray-900 border-gray-800 p-0">
                <div className="flex flex-col h-full">
                  <div className="border-b border-gray-800 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Menu</span>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800">
                          <X className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-2">
                    <div className="flex flex-col space-y-1 px-2">
                      {navigationLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`${
                            pathname === link.href
                              ? 'bg-gradient-to-r from-blue-900/50 to-teal-900/50 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    
                    {!isAuthenticated && (
                      <div className="mt-6 px-3">
                        <Link href="/auth/login" className="w-full mb-2">
                          <Button 
                            variant="default" 
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/auth/signup" className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-700 text-white hover:bg-gray-800"
                          >
                            Register
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {isAuthenticated && (
                    <div className="border-t border-gray-800 p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src="/placeholder-user.jpg" alt="User profile" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-800 to-teal-800 text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">{user?.name || 'Rahul Sharma'}</p>
                          <p className="text-xs text-gray-400">{user?.email || 'rahul.sharma@example.com'}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-700 text-white hover:bg-gray-800 flex items-center justify-center space-x-2"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 text-red-400" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-gray-800">
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-teal-500"></span>
                  <Bell className="h-5 w-5 text-gray-300 hover:text-white" />
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 rounded-full overflow-hidden p-0.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 transition-all duration-300"
                    >
                      <Avatar className="h-full w-full border border-white/10">
                        <AvatarImage src="/placeholder-user.jpg" alt="User profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-800 to-teal-800 text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 mt-2 bg-gray-900 border border-gray-700 shadow-lg shadow-teal-500/10 rounded-xl p-1" 
                    align="end" 
                    forceMount
                  >
                    <div className="p-2 mb-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md">
                      <DropdownMenuLabel className="font-normal p-0 mb-1">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-white">{user?.name || 'Rahul Sharma'}</p>
                          <p className="text-xs leading-none text-gray-400">{user?.email || 'rahul.sharma@example.com'}</p>
                        </div>
                      </DropdownMenuLabel>
                      <div className="py-1 px-1 mt-1">
                        <Link href="/profile" className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full text-xs h-7 border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-gray-700 my-1" />
                    
                    <div className="p-1">
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-md p-2 focus:bg-gray-800/80 text-gray-200 focus:text-white transition-colors" 
                        asChild
                      >
                        <Link href="/profile?tab=personal" className="flex items-center">
                          <User className="mr-3 h-4 w-4 text-blue-400" />
                          <div>
                            <span className="block text-sm">My Profile</span>
                            <span className="block text-xs text-gray-400">Personal Information</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-md p-2 focus:bg-gray-800/80 text-gray-200 focus:text-white transition-colors" 
                        asChild
                      >
                        <Link href="/profile?tab=orders" className="flex items-center">
                          <ShoppingBag className="mr-3 h-4 w-4 text-teal-400" />
                          <div>
                            <span className="block text-sm">Order History</span>
                            <span className="block text-xs text-gray-400">View past orders</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-md p-2 focus:bg-gray-800/80 text-gray-200 focus:text-white transition-colors" 
                        asChild
                      >
                        <Link href="/profile?tab=medical" className="flex items-center">
                          <FileText className="mr-3 h-4 w-4 text-purple-400" />
                          <div>
                            <span className="block text-sm">Medical Records</span>
                            <span className="block text-xs text-gray-400">Health documents</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-md p-2 focus:bg-gray-800/80 text-gray-200 focus:text-white transition-colors" 
                        asChild
                      >
                        <Link href="/profile?tab=appointments" className="flex items-center">
                          <Calendar className="mr-3 h-4 w-4 text-yellow-400" />
                          <div>
                            <span className="block text-sm">My Appointments</span>
                            <span className="block text-xs text-gray-400">Upcoming consultations</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        className="cursor-pointer rounded-md p-2 focus:bg-gray-800/80 text-gray-200 focus:text-white transition-colors" 
                        asChild
                      >
                        <Link href="/profile?tab=settings" className="flex items-center">
                          <Settings className="mr-3 h-4 w-4 text-orange-400" />
                          <div>
                            <span className="block text-sm">Account Settings</span>
                            <span className="block text-xs text-gray-400">Preferences & security</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-gray-700 my-1" />
                    
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-md m-1 p-2 focus:bg-red-900/20 hover:bg-red-900/20 text-red-500"
                      onClick={logout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <div>Sign Out</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

