import PackageDetail from "@/components/PackageDetail"
import DoctorSelection from "@/components/DoctorSelection"

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <PackageDetail id={params.id} />
      <DoctorSelection packageId={params.id} />
    </div>
  )
}

