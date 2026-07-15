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