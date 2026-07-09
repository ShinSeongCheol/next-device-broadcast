import {NextRequest, NextResponse} from "next/server";
import {getDeviceList} from "@/src/app/_services/device";

export async function GET(req: NextRequest) {
    const deviceList = await getDeviceList()
    return NextResponse.json(deviceList)
}