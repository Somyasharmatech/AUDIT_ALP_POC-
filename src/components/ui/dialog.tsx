import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/src/lib/utils"

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="z-50 grid w-full max-w-lg gap-4 bg-white p-6 shadow-lg sm:rounded-sm border border-[#DEE2E6] animate-in fade-in-90 zoom-in-95">
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-[#212529]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#6C757D]", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ({ onClick, className }: { onClick?: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#005A9E] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500",
      className
    )}
  >
    <X className="h-4 w-4 text-[#6C757D]" />
    <span className="sr-only">Close</span>
  </button>
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose }
