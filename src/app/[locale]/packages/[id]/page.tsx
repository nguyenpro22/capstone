import DoctorSelection from "@/components/home/DoctorSelection";
import PackageDetail from "@/components/home/PackageDetail";

export default function PackageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <PackageDetail id={params.id} />
      <DoctorSelection packageId={params.id} />
    </div>
  );
}
