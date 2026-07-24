'use client';

import {useState} from "react";
import {deleteAudioAction} from "@/src/feature/audio/actions";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontalIcon, Trash2Icon} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface Props {
    title: string;
    uuid: string;
}

export default function ColumnActions({title, uuid}: Props) {

    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);


    const handleDelete = async () => {
        try {
            await deleteAudioAction(uuid);
            setIsAlertOpen(false);
        }catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={'text-right'}>
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant={'ghost'} size={'icon'}>
                        <MoreHorizontalIcon className={'size-4'}/>
                    </Button>
                }>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem variant={'destructive'} onClick={() => setIsAlertOpen(true)}><Trash2Icon/> 삭제</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent size={'sm'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title} 삭제?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant={'outline'}>취소</AlertDialogCancel>
                        <AlertDialogAction variant={'destructive'} onClick={handleDelete}>삭제</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}