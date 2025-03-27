import type { Metadata } from "next"
import PackageList from "@/components/clinicManager/packages/package-list"

export const metadata: Metadata = {
  title: "Buy Package - Beautify",
  description: "Purchase premium packages for your beauty clinic",
}


export default function BuyPackagePage() {
    
  return <PackageList />
}

