import {selectDevice, selectDeviceList, updateDeviceHealth} from "@/src/app/_repository/device";
import {execTelnetCommand, getTelnetOption} from "@/src/lib/server";

export async function getDevice(deviceId:number) {
    return await selectDevice(deviceId);
}

export async function getDeviceList() {
    return  await selectDeviceList();
}

export async function updateHealth(deviceId: number) {
    const device = await getDevice(deviceId);
    if (!device) {
        throw new Error("장비를 찾지 못했습니다.")
    }

    try {
        const telnetOption = getTelnetOption({
            host: device.ip,
            port: device.port,
            username: device.username || '',
            password: device.password || ''
        });

        const res = await execTelnetCommand(telnetOption, 'echo HEALTH_OK');

        if (!res) {
            throw new Error("장비 응답이 없습니다.")
        }

        await updateDeviceHealth({deviceId: Number(deviceId), status: "NORMAL"})

        return res

    } catch {
        await updateDeviceHealth({deviceId: Number(deviceId), status: "ERROR"})
        throw new Error(`[${device.ip}]: ${device.name} 장비와 통신 오류 발생`)
    }
}