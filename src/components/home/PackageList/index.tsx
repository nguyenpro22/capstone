import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for packages
const packages = [
  { id: 1, name: "Facial Rejuvenation", description: "Complete facial treatment package", price: 299 },
  { id: 2, name: "Body Sculpting", description: "Full body contouring and toning", price: 499 },
  { id: 3, name: "Hair Restoration", description: "Advanced hair growth and restoration", price: 399 },
]

export default function PackageList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
            <CardDescription>{pkg.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${pkg.price}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/packages/${pkg.id}`} passHref>
              <Button>View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

