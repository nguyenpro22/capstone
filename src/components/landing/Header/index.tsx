import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const ThemeToggle = dynamic(() => import("@/components/common/ThemeToggle"), { ssr: false })
const LangToggle = dynamic(() => import("@/components/common/LangToggle"), { ssr: false })

export default function Header() {
  return (
    <header className="py-4 px-6 bg-background">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Beautify Clinic
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="#services" className="text-foreground hover:text-primary">
                Services
              </Link>
            </li>
            <li>
              <Link href="#livestream" className="text-foreground hover:text-primary">
                Livestream
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="text-foreground hover:text-primary">
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-foreground hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LangToggle />
          <Button>Book Appointment</Button>
        </div>
      </div>
    </header>
  )
}

