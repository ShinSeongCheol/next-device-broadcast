import {NextRequest, NextResponse} from "next/server";
import {getDevice} from "@/src/app/_services/device";

type RouteContext = {
    params: Promise<{
        deviceId: string;
    }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
    const {deviceId} = await context.params;

    const device =  await getDevice(Number(deviceId));
    return NextResponse.json(device)
}