import * as React from "react"
import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin text-muted-foreground", className)}
      {...props}
    />
  )
}

export function SpinnerCustom() {
  return (
    <div className="flex w-full flex-1 items-center justify-center min-h-[50vh]">
      <Spinner />
    </div>
  )
}
