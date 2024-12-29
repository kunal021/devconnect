import { UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-full md:w-64 lg:w-72 border-r border-base-300 flex flex-col shrink-0">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UserPlus className="size-6" />
          <span className="font-medium block">Connections</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </label>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="scroll flex-1 overflow-y-auto">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
          >
            <div className="relative mx-0">
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900" />
            </div>

            <div className="block text-left min-w-0 flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
