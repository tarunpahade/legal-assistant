"use client";
import { Button } from "@/components/ui/button";
import {
 
  RefreshCcw,
  Upload,
} from "lucide-react";
import { usePathname } from "next/navigation";


export default function Header() {
  const pathname = usePathname()

    return (
        <header className="flex items-center justify-between border-b p-2">
        <div className="flex items-center space-x-2">
          {/* <Button variant="ghost" size="sm">
            <span className="sr-only">Toggle sidebar</span>
          </Button> */}
          <h2 className="text-sm font-semibold">{pathname}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="h-4 w-4" />
            <span className="sr-only">Export</span>
          </Button>
        </div>
      </header>
  
    )
}