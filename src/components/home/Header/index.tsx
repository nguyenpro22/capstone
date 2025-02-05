import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Beauty Clinic
        </Link>
        <div className="space-x-4">
          <Link href="/packages">
            <Button variant="ghost">Packages</Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost">Orders</Button>
          </Link>
          <Link href="/appointments">
            <Button variant="ghost">Appointments</Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost">Chat</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

