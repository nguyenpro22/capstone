"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubscriptionsQuery } from "@/features/clinic/api";
import { SubscriptionPackages } from "@/components/clinicManager/subscription-packages";
import { SubscriptionTable } from "@/components/clinicManager/subscription-table";

type SubscriptionViewType = "cards" | "table";
export default function SubscriptionDashboard() {
  const { data, isLoading, isError } = useGetSubscriptionsQuery({});
  const [activeTab, setActiveTab] = useState<SubscriptionViewType>("cards");

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs
        defaultValue="cards"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SubscriptionViewType)}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cards" className="mt-0">
          {isLoading ? (
            <SubscriptionSkeleton type="cards" />
          ) : (
            <SubscriptionPackages mockData={data} />
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          {isLoading ? (
            <SubscriptionSkeleton type="table" />
          ) : (
            <SubscriptionTable mockData={data} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SubscriptionSkeletonProps {
  type: SubscriptionViewType;
}

function SubscriptionSkeleton({ type }: SubscriptionSkeletonProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full mb-2" />
        ))}
      </div>
    </div>
  );
}
