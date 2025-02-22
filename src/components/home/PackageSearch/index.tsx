"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function PackageSearch() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implement search logic here
    console.log("Searching for:", searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
      <Input
        type="text"
        placeholder="Search for beauty packages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </form>
  )
}

