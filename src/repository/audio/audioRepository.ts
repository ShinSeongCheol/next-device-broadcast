import 'server-only';

import {prisma} from "@/src/repository/prisma";
import {Audio, AudioCommon, AudioFormat} from "@/src/repository/audio/types";

export async function createAudio(params: {uuid: string, name: string, extension: string, path: string}): Promise<Audio> {
    return prisma.audio.create({
        data: {
            uuid: params.uuid,
            name: params.name,
            extension: params.extension,
            path: params.path,
        },
    });
}

export async function createAudioCommon(params: {audioId: number, title: string|undefined, artist: string|undefined, album:string|undefined, year: number|undefined, picturePath: string|undefined}): Promise<AudioCommon> {
    return prisma.audioCommon.create({
        data: {
            audioId: params.audioId,
            title: params?.title,
            artist: params?.artist,
            album: params?.album,
            year: params?.year,
            picturePath: params?.picturePath
        }
    })
}

export async function createAudioFormat(params: {audioId:number,container:string|undefined,codec:string|undefined,sampleRate:number|undefined,numberOfChannels:number|undefined, bitrate:number|undefined, duration:number|undefined}): Promise<AudioFormat> {
    return prisma.audioFormat.create({
        data: {
            audioId: params.audioId,
            container: params?.container,
            codec: params?.codec,
            sampleRate: params?.sampleRate,
            numberOfChannels: params?.numberOfChannels,
            bitrate: params?.bitrate,
            duration: params?.duration,
        }
    })
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