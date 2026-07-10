import {NextRequest, NextResponse} from "next/server";
import {RouteContext} from "@/src/app/api/devices/[deviceId]/types";

export async function POST(req: NextRequest, context: RouteContext) {
    const { deviceId } = await context.params;

    console.log(deviceId)

    return NextResponse.json({});
}