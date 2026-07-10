import {NextRequest, NextResponse} from "next/server";
import {getDeviceVolume, updateDeviceVolume} from "@/src/service/device";
import {RouteContext} from "@/src/app/api/devices/[deviceId]/types";

export async function GET(req: NextRequest, context: RouteContext) {
    const {deviceId} = await context.params
    const {searchParams} = req.nextUrl;
    const audioCardId = Number(searchParams.get("audioCardId"));

    const volumes = await getDeviceVolume(Number(deviceId), audioCardId);

    return NextResponse.json(volumes);
}

export async function POST(req:NextRequest, context:RouteContext) {
    const {deviceId} = await context.params

    const body = await req.json()
    const {mixerControlId, volume} = body

    const mixerControl = await updateDeviceVolume(Number(deviceId), mixerControlId, volume)

    return NextResponse.json(mixerControl);
}