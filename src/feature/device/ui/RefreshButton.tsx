'use client';

import {Button} from "@/components/ui/button";
import {RotateCw} from "lucide-react";
import {refreshDeviceAction} from "@/src/feature/device/actions";

interface Props {
    deviceIdList: number[];
}

export default function RefreshButton({deviceIdList}: Props){

    const handleRefresh = async () => {
        await refreshDeviceAction(deviceIdList)
    }

    return(
        <Button variant={'outline'} onClick={handleRefresh}>
            <RotateCw/> 동기화
        </Button>
    )
}