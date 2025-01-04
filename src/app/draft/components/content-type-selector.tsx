import { FileIcon as FilePresentation, Globe, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ContentTypeSelector() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button
        variant="outline"
        className="h-auto p-4 hover:bg-violet-50 data-[state=selected]:bg-violet-100 hover:border-violet-200"
        data-state="selected"
      >
        <div className="flex flex-col items-center gap-2">
          <FilePresentation className="w-6 h-6 text-violet-600" />
          <span>Presentation</span>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-auto p-4 hover:bg-violet-50 data-[state=selected]:bg-violet-100 hover:border-violet-200"
      >
        <div className="flex flex-col items-center gap-2">
          <Globe className="w-6 h-6 text-gray-600" />
          <span>Webpage</span>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-auto p-4 hover:bg-violet-50 data-[state=selected]:bg-violet-100 hover:border-violet-200"
      >
        <div className="flex flex-col items-center gap-2">
          <FileText className="w-6 h-6 text-gray-600" />
          <span>Document</span>
        </div>
      </Button>
    </div>
  )
}

