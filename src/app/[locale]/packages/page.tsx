import PackageSearch from "@/components/PackageSearch"
import PackageList from "@/components/PackageList"

export default function PackagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Beauty Packages</h1>
      <PackageSearch />
      <PackageList />
    </div>
  )
}

