export type Audio = {
    id: number;
    uuid: string;
    name: string;
    extension: string;
    path: string;
    createdAt: Date,
    updatedAt: Date,
}

export type AudioCommon = {
    id: number;
    audioId: number;
    title: string|null;
    artist: string|null;
    album: string|null;
    year: number|null;
    picturePath: string|null;
}

export type AudioFormat = {
    id: number;
    audioId: number;
    container: string|null;
    codec: string|null;
    sampleRate: number|null;
    numberOfChannels: number|null;
    bitrate: number|null;
    duration: number|null;
}

export type AudioDetail = {
    id: number;
    uuid: string;
    name: string;
    extension: string;
    path: string;
    createdAt: Date,
    updatedAt: Date,
    audioFormat: {
        id: number;
        container: string|null;
        codec: string|null;
        sampleRate: number|null;
        numberOfChannels: number|null;
        bitrate: number|null;
        duration: number|null;
    } | null,
    audioCommon: {
        id: number;
        title: string|null;
        artist: string|null;
        album: string|null;
        year: number|null;
        picturePath: string|null;
    } | null;
}