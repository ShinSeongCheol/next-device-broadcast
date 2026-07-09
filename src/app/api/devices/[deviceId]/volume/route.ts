import {NextRequest, NextResponse} from "next/server";
import {getDeviceVolume, updateDeviceVolume} from "@/src/app/_services/device";

type RouteContext = {
    params: Promise<{
        deviceId: number;
    }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
    const {deviceId} = await context.params
    const {searchParams} = req.nextUrl;
    const audioCardId = Number(searchParams.get("audioCardId"));

    const volumes = await getDeviceVolume(deviceId, audioCardId);

    return NextResponse.json(volumes);
}

export async function POST(req:NextRequest, context:RouteContext) {
    const {deviceId} = await context.params

    const body = await req.json()
    const {mixerControlId, volume} = body

    const mixerControl = await updateDeviceVolume(deviceId, mixerControlId, volume)

    return NextResponse.json(mixerControl);
}