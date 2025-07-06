"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { Download, Smartphone, Check, Loader2 } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InstallButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showLabel?: boolean
}

export function InstallButton({ 
  variant = "default", 
  size = "default",
  className = "",
  showLabel = true
}: InstallButtonProps) {
  const { 
    canInstall, 
    isIOS, 
    isSafari,
    install, 
    installationStatus 
  } = usePWAInstall()
  const [showIOSDialog, setShowIOSDialog] = useState(false)
  
  if (!canInstall && !isIOS) {
    return null
  }
  
  const handleClick = async () => {
    if (isIOS && isSafari) {
      setShowIOSDialog(true)
      return
    }
    
    await install()
  }
  
  const isPending = installationStatus === 'pending'
  const isSuccess = installationStatus === 'success'
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isPending || isSuccess}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSuccess ? (
          <Check className="h-4 w-4" />
        ) : isIOS ? (
          <Smartphone className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />
        ) : (
          <Download className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />
        )}
        {showLabel && (
          <span>
            {isPending ? "Installing..." : 
             isSuccess ? "Installed" : 
             isIOS ? "Install App" : 
             "Install App"}
          </span>
        )}
      </Button>
      
      {/* iOS Installation Instructions Dialog */}
      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install MessHub on iOS</DialogTitle>
            <DialogDescription>
              Follow these steps to add MessHub to your home screen:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Tap the Share button</p>
                <p className="text-sm text-muted-foreground">
                  Look for the share icon in Safari's bottom toolbar
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                <p className="text-sm text-muted-foreground">
                  You may need to scroll down to find this option
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Tap "Add" in the top-right corner</p>
                <p className="text-sm text-muted-foreground">
                  MessHub will be added to your home screen
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowIOSDialog(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 