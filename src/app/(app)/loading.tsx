import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading todos">
      <h1 className="text-2xl font-semibold tracking-tight">Your todos</h1>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-56 rounded-lg" />
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
              <Skeleton className="size-4 rounded-[4px]" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="size-7" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
