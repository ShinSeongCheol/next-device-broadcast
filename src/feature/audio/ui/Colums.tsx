'use client';

import {ColumnDef, RowData} from "@tanstack/react-table";
import {AudioDetail} from "@/src/repository/audio/types";
import {Pause, Play} from "lucide-react";
import {Button} from "@/components/ui/button";

import ColumnActions from "@/src/feature/audio/ui/ColumnActions";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        currentUuid: string | null;
        isPlaying: boolean;
        togglePlay: (uuid: string) => void;
    }
}

export const AudioColumns: ColumnDef<AudioDetail>[] = [
    {
        id: 'preview',
        header: '',
        cell: ({row, table}) => {
            const uuid = row.original.uuid;
            const {currentUuid, isPlaying, togglePlay } = table.options.meta ?? {};
            const isCurrentPlaying = currentUuid === uuid && isPlaying;
            
            return (
                <div className={'text-center'}>
                    <Button variant={'outline'} size={'icon'} onClick={() => togglePlay?.(uuid)}>
                        {isCurrentPlaying ? <Pause/> : <Play/>}
                    </Button>
                </div>
            )
        }
    },
    {
        id: 'title',
        header: '타이틀',
        cell: ({row}) => {
            const title = row.original.audioCommon?.title;
            return title;
        }
    },
    {
        id: 'artist',
        header: '아티스트',
        cell: ({row}) => {
            const artist = row.original.audioCommon?.artist;
            return artist;
        }
    },
    {
        id: 'duration',
        header: '길이',
        cell: ({row}) => {
            const duration = row.original.audioFormat?.duration;

            if (!duration) return '-';

            const minutes = (duration / 60).toFixed(2);
            return minutes;
        }
    },
    {
        accessorKey: 'createdAt',
        header: '등록일',
        cell: ({row}) => {
            const createdAt = new Date(row.getValue('createdAt'));
            return `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
        }
    },
    {
        id: 'actions',
        header: '',
        cell: ({row}) => {
            const {audioCommon, uuid} = row.original
            const title = audioCommon?.title || '';

            return <ColumnActions title={title} uuid={uuid}/>
        }
    }
]