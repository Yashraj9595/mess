"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { User, Lock, Upload, Trash2, ChevronLeft, Plus, Camera, X, Mail, Phone, MapPin, Building2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { MobileNavigation } from "./mobile-navigation"

export function ProfileTabs() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  type FormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    messName: string;
    messType: string[];
    colleges: string[];
    collegeInput: string;
    logo: string | null;
    avatar: string;
  }
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "Sarah Kitchen",
    email: user?.email || "owner@example.com",
    phone: "9876543210",
    address: "123 Main Street, City, State, 400001",
    bio: "Experienced mess owner with a passion for providing quality food service.",
    messName: "Green Valley Mess",
    messType: ["Veg", "Mixed"],
    colleges: ["ABC Engineering College", "XYZ University"],
    collegeInput: "",
    logo: null,
    avatar: user?.avatar || ""
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(formData.avatar)
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const messTypeOptions = ["Veg", "Non-Veg", "Mixed"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleMessTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      messType: prev.messType.includes(type)
        ? prev.messType.filter((t: string) => t !== type)
        : [...prev.messType, type]
    }))
  }
  const handleAddCollege = () => {
    if (formData.collegeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        colleges: [...prev.colleges, prev.collegeInput.trim()],
        collegeInput: ""
      }))
    }
  }
  const handleRemoveCollege = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      colleges: prev.colleges.filter((_, i) => i !== idx)
    }))
  }
  const handleAvatarClick = () => avatarInputRef.current?.click()
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  const handleLogoClick = () => logoInputRef.current?.click()
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${isMobile ? "pb-24" : ""}`}> 
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-background sticky top-0 z-10 border-b border-border">
        <Button variant="ghost" size="icon" className="text-foreground" onClick={() => router.push("/mess-owner/settings")}> 
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
        <span className="w-6" />
      </div>

      <div className={`flex-1 flex flex-col gap-6 ${isMobile ? "px-2 max-w-md mx-auto w-full" : "px-8 max-w-2xl mx-auto w-full"}`}>
        {/* Avatar */}
        <div className="flex flex-col items-center mt-6 mb-2">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center">
              {avatarPreview ? (
                <Avatar className="w-28 h-28">
                  <AvatarImage src={avatarPreview} alt="Profile photo" />
                  <AvatarFallback><Camera className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                </Avatar>
              ) : (
                <Camera className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 rounded-full bg-primary-blue text-white border-2 border-background shadow-lg hover:bg-primary"
              onClick={handleAvatarClick}
              aria-label="Upload profile photo"
              disabled
            >
              <Plus className="h-4 w-4" />
            </Button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled
            />
          </div>
          <span className="mt-3 text-sm text-muted-foreground">Upload profile photo</span>
        </div>

        {/* Personal Information Card */}
        <Card className="rounded-lg border text-card-foreground shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-[#145374] dark:text-[#5588A3]" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Manage your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input id="profile-name" name="name" value={formData.name} disabled placeholder="Enter your full name" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-[#145374] dark:focus:border-[#5588A3] focus:ring-[#145374] dark:focus:ring-[#5588A3]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5588A3] dark:text-[#5588A3]" />
                  <Input id="profile-email" name="email" value={formData.email} disabled type="email" placeholder="Email" className="pl-10 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-[#5588A3] dark:text-[#5588A3]" />
                <Input id="phone" name="phone" value={formData.phone} disabled placeholder="Enter phone number" className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-[#145374] dark:focus:border-[#5588A3] focus:ring-[#145374] dark:focus:ring-[#5588A3]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#5588A3] dark:text-[#5588A3]" />
                <Textarea id="address" name="address" value={formData.address} disabled placeholder="Enter your address" className="pl-10 min-h-[80px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-[#145374] dark:focus:border-[#5588A3] focus:ring-[#145374] dark:focus:ring-[#5588A3]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} disabled placeholder="Tell us about yourself" className="min-h-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-[#145374] dark:focus:border-[#5588A3] focus:ring-[#145374] dark:focus:ring-[#5588A3]" />
            </div>
          </CardContent>
        </Card>

        {/* Mess Information Card */}
        <Card className="rounded-lg border text-card-foreground shadow-lg border-[#145374]/20 dark:border-[#5588A3]/30 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <Building2 className="h-5 w-5 text-[#145374] dark:text-[#5588A3]" />
              Mess Information
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Configure your mess details and services
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="messName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mess Name</Label>
              <Input id="messName" name="messName" value={formData.messName} disabled placeholder="e.g. The Green Mess, Student Mess" className="bg-white dark:bg-gray-800 border-[#145374]/40 dark:border-[#5588A3]/40 text-gray-900 dark:text-white focus:border-[#145374] dark:focus:border-[#5588A3] focus:ring-[#145374] dark:focus:ring-[#5588A3]" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mess Type</Label>
              <div className="flex gap-2 flex-wrap">
                {messTypeOptions.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.messType.includes(type) ? "default" : "outline"}
                    className={formData.messType.includes(type)
                      ? "bg-[#145374] hover:bg-[#00334E] dark:bg-[#5588A3] dark:hover:bg-[#145374] text-white"
                      : "border bg-background hover:text-accent-foreground border-[#145374]/40 dark:border-[#5588A3]/40 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                    disabled
                    aria-pressed={formData.messType.includes(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nearby Colleges</Label>
              <div className="flex flex-wrap gap-2">
                {formData.colleges.map((college, idx) => (
                  <div
                    key={idx}
                    className="rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 flex items-center gap-1 bg-[#145374]/10 text-[#145374] dark:bg-[#5588A3]/20 dark:text-[#5588A3] border-[#145374]/20 dark:border-[#5588A3]/30 px-3 py-1"
                  >
                    {college}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mess Logo</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-[#145374]/30 dark:border-[#5588A3]/40">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Mess Logo" className="object-cover w-full h-full" />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                    disabled
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Upload your mess logo</p>
                  <p className="text-xs">Recommended: 200x200px</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
          <MobileNavigation 
            activeSection="profile" 
            onSectionChange={(section) => {
              if (section === "profile") {
                // Already on profile page
                return;
              } else if (section === "settings") {
                router.push("/mess-owner/settings");
              } else {
                router.push("/mess-owner/dashboard");
              }
            }} 
          />
        </div>
      )}
    </div>
  )
}