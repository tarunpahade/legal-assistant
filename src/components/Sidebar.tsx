"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"

interface SidebarItem {
  name: string
}

const sidebarItems: SidebarItem[] = [
  { name: "Storage" },
  // { name: "Draft" },
  { name: "Search" },
]

export default function Sidebar() {
    const router=useRouter()
    const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r h-screen">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">MikeAI</h1>
      </div>
      <nav className="p-2">
        {sidebarItems.map((item) => {
          const lowercaseName = item.name.toLowerCase()
          const isActive = pathname === `/${lowercaseName}`; // Check if the current path matches

          return (
            <Link key={item.name} href={`/${lowercaseName}`} passHref>
              <Button
                onClick={() => {
                  console.log('hii');
                  router.push(`/${lowercaseName}`)
                }}
                variant="ghost"
                className={`w-full justify-start text-sm py-2 px-4 mb-1 ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
