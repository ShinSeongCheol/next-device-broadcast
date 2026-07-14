'use client';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {useRef, useState} from "react";

interface Props<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function DataTable<TData, TValue>({columns, data,}: Props<TData, TValue>) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentUuid, setCurrentUuid] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = (uuid: string) => {
        if (!audioRef.current) return;

        if (currentUuid !== uuid) {
            audioRef.current.src = `${location.origin}/api/audio/${uuid}`;
            audioRef.current.play()
                .then(() => {
                    setCurrentUuid(uuid);
                    setIsPlaying(true);
                })
                .catch(err => console.error(err));
            return;
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true));
        }
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        meta: {
            currentUuid,
            isPlaying,
            togglePlay,
        }
    })

    return (
        <div className={'flex flex-col gap-4'}>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Label className={'text-xs text-gray-500'}>페이지당 행 수</Label>
                <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => {table.setPageSize(Number(value))}}>
                    <SelectTrigger>
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 30, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Label className={'text-xs text-gray-500'}>
                    약 {data.length}개중 {(table.getState().pagination.pageIndex) * table.getState().pagination.pageSize + 1}~{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}개
                </Label>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft/>
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight/>
                </Button>
            </div>
            <div className="p-4">
                <audio
                    ref={audioRef}
                    onEnded={() => setIsPlaying(false)}
                />
            </div>
        </div>
    )
}