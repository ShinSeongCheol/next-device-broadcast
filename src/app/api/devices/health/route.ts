import {NextRequest, NextResponse} from "next/server";
import {getDeviceList, updateDeviceHealth} from "@/src/lib/server/prisma";
import {execTelnetCommand, getTelnetOption} from "@/src/lib/server";

export async function GET(req: NextRequest) {

    const deviceList = await getDeviceList();
    for (const device of deviceList) {

        try {
            const telnetOption = getTelnetOption({
                host: device.ip,
                port: device.port,
                username: device.username || "",
                password: device.password || ""
            });
            const res = await execTelnetCommand(telnetOption, "echo health ok");

            if (!res) {
                 await updateDeviceHealth({deviceId: device.id, status: "NORMAL"})
            }

            await updateDeviceHealth({deviceId: device.id, status: "NORMAL"})

        }catch (error) {
            await updateDeviceHealth({deviceId: device.id, status: "ERROR"})
        }
    }
    return NextResponse.json({})
}