import {NextRequest, NextResponse} from "next/server";
import {getDevice} from "@/src/service/device";

type RouteContext = {
    params: Promise<{
        deviceId: number;
    }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
    const {deviceId} = await context.params;

    const device =  await getDevice(Number(deviceId));
    return NextResponse.json(device)
}