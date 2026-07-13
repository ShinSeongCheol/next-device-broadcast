import {NextRequest, NextResponse} from "next/server";
import {getDevice} from "@/src/service/device";
import {RouteContext} from "@/src/app/api/devices/[deviceId]/types";

export async function GET(req: NextRequest, context: RouteContext) {
    const {deviceId} = await context.params;

    const device =  await getDevice(Number(deviceId));
    return NextResponse.json(device)
}