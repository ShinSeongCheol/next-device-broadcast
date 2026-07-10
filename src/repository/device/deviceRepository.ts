import 'server-only'

import {prisma} from "@/src/repository/prisma";

export async function selectDeviceList() {
    return prisma.device.findMany({
        orderBy: {
            id: 'asc',
        }
    })
}

export async function selectDevice(deviceId: number) {
    return prisma.device.findFirst({
        where: {
            id: Number(deviceId)
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

export async function upsertDeviceAudioCard(params: {deviceId:number, cardIndex:number, name:string}) {
    return prisma.audioCard.upsert({
        create: {
            deviceId: Number(params.deviceId),
            cardIndex: Number(params.cardIndex),
            name: params.name
        },
        update: {
            name: params.name
        },
        where: {
            deviceId_cardIndex: {
                deviceId: Number(params.deviceId),
                cardIndex: Number(params.cardIndex)
            }
        }
    })
}

export async function upsertDeviceMixerControls(params: {audioCardId: number, name: string, volume: string}) {
    return prisma.mixerControl.upsert({
        create: {
            audioCardId: Number(params.audioCardId),
            name: params.name,
            volume: params.volume,
        },
        update: {
            volume: params.volume,
        },
        where: {
            audioCardId_name: {
                audioCardId: Number(params.audioCardId),
                name: params.name
            }
        }
    })
}

export async function updateDeviceMixerControl(params: {mixerControlId:number, volume: string}) {
    return prisma.mixerControl.update({
        data: {
            volume: String(params.volume)
        },
        where: {
            id: params.mixerControlId,
        }
    })
}

export async function selectDeviceMixerControls(params: {deviceId: number, audioCardId: number}) {
    return prisma.mixerControl.findMany({
        where: {
            audioCardId: params.audioCardId
        }
    })
}

export async function selectDeviceMixerControl(params:{mixerControlId: number}) {
    return prisma.mixerControl.findUnique({
        where: {
            id: Number(params.mixerControlId),
        }
    })
}