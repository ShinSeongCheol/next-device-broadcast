import { getDevice } from "@/src/lib/server/prisma";
import {NextRequest, NextResponse} from "next/server";

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