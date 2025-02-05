import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for orders
const orders = [
  { id: 1, packageName: "Facial Rejuvenation", date: "2023-05-15", status: "Completed", price: 299 },
  { id: 2, packageName: "Body Sculpting", date: "2023-06-01", status: "In Progress", price: 499 },
  { id: 3, packageName: "Hair Restoration", date: "2023-06-10", status: "Scheduled", price: 399 },
]

export default function OrderList() {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>{order.packageName}</CardTitle>
            <CardDescription>Order Date: {order.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Status: {order.status}</p>
            <p className="text-2xl font-bold mt-2">${order.price}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/orders/${order.id}`} passHref>
              <Button>View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

