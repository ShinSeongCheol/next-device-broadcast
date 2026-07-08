import {NextRequest, NextResponse} from "next/server";
import {execTelnetCommand, getTelnetOption} from "@/src/lib/server";
import {getDevice, updateDeviceHealth} from "@/src/lib/server/prisma";

type RouteContext = {
    params: Promise<{
        deviceId: string;
    }>;
};

export async function GET(req: NextRequest, context: RouteContext)  {

    const {deviceId} = await context.params;

    try {
        const device = await getDevice(Number(deviceId));
        if (!device) {
            return NextResponse.json({}, {status: 400});
        }

        const telnetOption = getTelnetOption({
            host: device.ip,
            port: device.port,
            username: device.username || '',
            password: device.password || ''
        });

        const res = await execTelnetCommand(telnetOption, 'echo HEALTH_OK');

        if (!res) {
            return NextResponse.json({}, {status:503})
        }

        await updateDeviceHealth({deviceId: Number(deviceId), status: "NORMAL"})

        return NextResponse.json({
            result: res,
        })
    }catch (error) {
        await updateDeviceHealth({deviceId: Number(deviceId), status: "ERROR"})
        return NextResponse.json({}, {status:503})
    }
}