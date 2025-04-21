// "use client";

// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
//   type SortingState,
//   getSortedRowModel,
//   type ColumnFiltersState,
//   getFilteredRowModel,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuCheckboxItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState } from "react";
// import { useTranslations } from "next-intl";
// import { CalendarIcon, ChevronDown, MessageSquare } from "lucide-react";
// import { formatDate } from "../booking/utils/booking-utils";
// import { FeedbackDialog } from "./FeedbackDialog";
// import { orderDetail } from "@/config/i18n/messages/types/order-detail";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// export function OrderTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const t = useTranslations("Index");
//   const [currentPage, setCurrentPage] = useState(1);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   const getFeedbackStars = (rating: number) => {
//     let stars = "";
//     for (let i = 0; i < rating; i++) {
//       stars += "⭐";
//     }
//     return stars;
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder={`${t("filterOrders")}...`}
//           value={(table.getColumn("orderId")?.getFilterValue() as string) ?? ""}
//           onChange={(event) =>
//             table.getColumn("orderId")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               {t("columns")} <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) => column.toggleVisibility(value)}
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id} className="dark:text-indigo-200">
//                     {cell.column.id === "createdAt" ? (
//                       <div className="flex items-center">
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {formatDate(new Date(cell.getValue() as string))}
//                       </div>
//                     ) : cell.column.id === "feedback" ? (
//                       <>
//                         {columnVisibility.feedback && (
//                           <TableCell className="dark:text-indigo-200">
//                             {(row.original as Order).rating ? (
//                               getFeedbackStars((row.original as Order).rating!)
//                             ) : (row.original as orderDetail).status ===
//                               "Completed" ? (
//                               <FeedbackDialog
//                                 orderId={(row.original as orderDetail).orderId}
//                                 onFeedbackSubmitted={() => setCurrentPage(1)}
//                               >
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20"
//                                 >
//                                   <MessageSquare className="h-4 w-4 mr-1" />
//                                   {t("leaveFeedback")}
//                                 </Button>
//                               </FeedbackDialog>
//                             ) : (
//                               <span className="text-gray-500 italic">
//                                 {t("noFeedback")}
//                               </span>
//                             )}
//                           </TableCell>
//                         )}
//                       </>
//                     ) : (
//                       flexRender(cell.column.columnDef.cell, cell.getContext())
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//             {table.getRowModel().rows.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   {t("noResults")}
//                 </TableCell>
//               </TableRow>
//             ) : null}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {t("previous")}
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           {t("next")}
//         </Button>
//       </div>
//     </div>
//   );
// }
