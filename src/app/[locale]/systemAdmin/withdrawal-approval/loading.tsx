import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto py-6 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Loading transactions...</p>
      </div>
    </div>
  );
}
