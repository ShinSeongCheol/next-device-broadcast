import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontalIcon, Music, Music2Icon, SquarePenIcon, Trash2Icon} from "lucide-react";
import {Item, ItemActions, ItemContent, ItemTitle} from "@/components/ui/item";

interface props {
    path: string
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    uuid: string
    extension: string
}

export default function AudioItem(props: props) {
    return (
        <Item variant={'outline'}>
            <ItemContent>
                <ItemTitle><Music/>|<span>{props.name}{props.extension}</span></ItemTitle>
            </ItemContent>
            <ItemActions>
                <DropdownMenu>

                    <DropdownMenuTrigger render={
                        <button aria-label={'More Options'}>
                            <MoreHorizontalIcon className={'size-4'}/>
                        </button>}
                    >
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem><SquarePenIcon/> 수정</DropdownMenuItem>
                        <DropdownMenuItem variant={'destructive'}><Trash2Icon/> 삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ItemActions>
        </Item>
    )
}