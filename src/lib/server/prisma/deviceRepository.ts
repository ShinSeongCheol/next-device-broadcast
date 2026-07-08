import 'server-only'

import {prisma} from "@/src/lib/server/prisma/prisma";

export async function getDeviceList() {
    return prisma.device.findMany({
        orderBy: {
            id: 'asc',
        }
    })
}

export async function getDevice(deviceId: number) {
    return prisma.device.findFirst({
        where: {
            id: deviceId
        }
    })
}

export async function updateDeviceHealth(params: {deviceId: number, status: "ERROR" | "NORMAL"}) {
    return prisma.device.update({
        where: {
            id: params.deviceId,
        },
        data: {
            healthStatus: params.status,
            lastHealthTime: new Date(),
        }
    })
}