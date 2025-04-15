import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorProfileView from "@/components/doctor/doctor-profile-view";

export default function DoctorProfilePage() {
  return (
    <div className="container py-10">
      <Suspense fallback={<ProfileSkeleton />}>
        <DoctorProfileView />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
