 import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export default function TableLoading() {
  return (
    <>
      <TableRow>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
      </TableRow>
    </>
  );
}
