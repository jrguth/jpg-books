import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Spinner = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("size-6 animate-spin", className)} />;
};

export const CenteredSpinner = ({ className }: { className?: string }) => (
  <div className="flex w-full items-center mt-2">
    <Spinner className={className} />
  </div>
);
