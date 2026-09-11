import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function ListProductSkeleton() {
    return (
        <>
            <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
                <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <Separator className="shadow" />

            <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 16 }).map((_, index) => (
                    <li key={index} className="rounded-lg border p-4 hover:shadow-md">
                        <div className="mb-8 flex items-center justify-between">
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}