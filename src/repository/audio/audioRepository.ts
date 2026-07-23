import 'server-only';

import {prisma} from "@/src/repository/prisma";
import {Audio, AudioCommon, AudioDetail, AudioFormat} from "@/src/repository/audio/types";

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

export async function getAudioList(): Promise<Audio[]> {
    return prisma.audio.findMany({
        orderBy: {
            id: 'asc'
        }
    })
}

export async function selectAudioDetails(): Promise<AudioDetail[]> {
    return prisma.audio.findMany({
        select: {
            id: true,
            uuid: true,
            name: true,
            extension: true,
            path: true,
            createdAt: true,
            updatedAt: true,
            audioFormat: {
                select: {
                    id: true,
                    container: true,
                    codec: true,
                    sampleRate: true,
                    numberOfChannels: true,
                    bitrate: true,
                    duration: true,
                }
            },
            audioCommon: {
                select: {
                    id: true,
                    title: true,
                    artist: true,
                    album: true,
                    year: true,
                    picturePath: true,
                }
            }
        },
    });
}

export async function selectAudioDetail(params: {audioId: number}): Promise<AudioDetail|null> {
    return prisma.audio.findUnique({
        select: {
            id: true,
            uuid: true,
            name: true,
            extension: true,
            path: true,
            createdAt: true,
            updatedAt: true,
            audioFormat: {
                select: {
                    id: true,
                    container: true,
                    codec: true,
                    sampleRate: true,
                    numberOfChannels: true,
                    bitrate: true,
                    duration: true,
                }
            },
            audioCommon: {
                select: {
                    id: true,
                    title: true,
                    artist: true,
                    album: true,
                    year: true,
                    picturePath: true,
                }
            }
        },
        where: {
            id: Number(params.audioId)
        }
    })
}