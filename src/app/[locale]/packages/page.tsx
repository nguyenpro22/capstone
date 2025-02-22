import PackageList from "@/components/home/PackageList";
import PackageSearch from "@/components/home/PackageSearch";

export default function PackagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Beauty Packages</h1>
      <PackageSearch />
      <PackageList />
    </div>
  );
}
