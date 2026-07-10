import {NextRequest, NextResponse} from "next/server";
import {updateHealth} from "@/src/service/device";
import {RouteContext} from "@/src/app/api/devices/[deviceId]/types";

export async function GET(req: NextRequest, context: RouteContext)  {

    const {deviceId} = await context.params;

    try {
        const res = await updateHealth(Number(deviceId));

        return NextResponse.json({
            result: res,
        })
    }catch (error) {
        return NextResponse.json({}, {status:503})
    }
}