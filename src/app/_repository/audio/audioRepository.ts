import 'server-only';

import {prisma} from "@/src/app/_repository/prisma";

export async function createAudio(params: {uuid: string, name: string, extension: string, path: string}) {
    return prisma.audio.create({
        data: {
            uuid: params.uuid,
            name: params.name,
            extension: params.extension,
            path: params.path,
        },
    });
}

export async function getAudio(uuid: string) {
    return prisma.audio.findUnique({
        where: {
            uuid: uuid,
        }
    })
}

export async function getAudioList() {
    return prisma.audio.findMany({
        orderBy: {
            id: 'asc'
        }
    })
}