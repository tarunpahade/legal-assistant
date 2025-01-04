import { Shield, Share2, GraduationCap, Rocket, Coffee, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const prompts = [
  {
    icon: Shield,
    title: "Cyber security basics",
    color: "text-violet-600",
  },
  {
    icon: Share2,
    title: "Social media marketing strategies",
    color: "text-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Intro genetics lesson",
    color: "text-teal-600",
  },
  {
    icon: Rocket,
    title: "Pitch deck for a startup that makes organic dog food",
    color: "text-fuchsia-600",
  },
  {
    icon: Coffee,
    title: "How to brew the perfect cup of espresso",
    color: "text-rose-600",
  },
  {
    icon: Brain,
    title: "Seminar on the psychology of decision-making",
    color: "text-purple-600",
  },
]

export default function ExamplePrompts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt, index) => (
        <Card key={index} className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-3 h-auto">
            <prompt.icon className={`w-5 h-5 ${prompt.color}`} />
            <span className="text-sm text-gray-600 text-left">{prompt.title}</span>
          </Button>
        </Card>
      ))}
    </div>
  )
}

