export type Device = {
    id: number;
    name: string | null;
    ip: string;
    port: number;
    username: string | null;
    password: string | null;
    healthStatus: string | null;
    lastHealthTime: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type DeviceDetail = {
    id: number,
    name: string | null,
    ip: string,
    port: number,
    username: string | null,
    password: string | null,
    healthStatus: string | null,
    lastHealthTime: Date | null,
    createdAt: Date,
    updatedAt: Date,
    audioCards: {
        id: number,
        cardIndex: number,
        name: string,
        createdAt: Date,
        updatedAt: Date,
        mixerControls: {
            id: number,
            name: string,
            createdAt: Date,
            updatedAt: Date,
            volume: string
        }[] | null
    }[] | null
}
