import {NextRequest, NextResponse} from "next/server";
import {getDeviceList, updateHealth} from "@/src/service/device";

export async function GET(req: NextRequest) {

    const deviceList = await getDeviceList();
    for (const device of deviceList) {

        try {
            await updateHealth(device.id)
        }catch(error) {
            console.log(error)
        }

    }
    return NextResponse.json({})
}