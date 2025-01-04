import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ContentTypeSelector from "./components/content-type-selector"
import ExamplePrompts from "./components/example-prompts"

export default function WritingAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="container max-w-4xl px-4 py-6">
        <Button variant="ghost" className="mb-8" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-medium text-gray-800">Generate</h1>
            <p className="text-lg text-gray-600">What would you like to create today?</p>
          </div>

          <ContentTypeSelector />

          <div className="flex flex-wrap gap-4 justify-center">
            <Select defaultValue="8">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Number of cards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 cards</SelectItem>
                <SelectItem value="8">8 cards</SelectItem>
                <SelectItem value="12">12 cards</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="default">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="en-US">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="p-4">
            <Textarea 
              placeholder="Describe what you'd like to make"
              className="min-h-[100px] border-0 focus-visible:ring-0 text-lg resize-none"
            />
          </Card>

          <div className="space-y-4">
            <p className="text-gray-500">Example prompts</p>
            <ExamplePrompts />
          </div>
        </div>
      </div>
    </div>
  )
}

