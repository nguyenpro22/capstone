"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Package {
  id: string
  name: string
  description: string
  price: number
  details: string[]
}

export default function PackageDetail({ id }: { id: string }) {
  const [packageData, setPackageData] = useState<Package | null>(null)

  useEffect(() => {
    // Fetch package data here
    // For now, we'll use mock data
    const mockPackage: Package = {
      id,
      name: "Facial Rejuvenation",
      description: "Complete facial treatment package",
      price: 299,
      details: ["Deep cleansing facial", "Microdermabrasion", "LED light therapy", "Hydrating mask"],
    }
    setPackageData(mockPackage)
  }, [id])

  if (!packageData) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{packageData.name}</CardTitle>
        <CardDescription>{packageData.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">${packageData.price}</p>
        <h3 className="text-lg font-semibold mb-2">Package Details:</h3>
        <ul className="list-disc pl-5">
          {packageData.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

