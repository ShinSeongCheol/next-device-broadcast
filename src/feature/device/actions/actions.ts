'use server';
import {createDevice, updateDeviceVolume, updateHealth} from "@/src/service/device";
import {revalidatePath} from "next/cache";
import {removeDevice} from "@/src/service/device/deviceService";

export async function createDeviceAction(formData: FormData) {
    const name = String(formData.get('name'));
    const ip = String(formData.get('ip'));
    const port = Number(formData.get('port'));
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    const data = {
        name,
        ip,
        port,
        username,
        password,
    }

    await createDevice(data);

    revalidatePath('/devices')
}

export async function updateDeviceVolumeAction(deviceId:number, mixerControlId:number, volume: number) {
    await updateDeviceVolume(deviceId,mixerControlId, String(volume));
}

export async function deleteDeviceAction(deviceId:number) {
    await removeDevice(deviceId);
    revalidatePath('/devices')
}

export async function refreshDeviceAction(deviceIdList:number[]) {
    for (const deviceId of deviceIdList) {
        try {
            await updateHealth(deviceId);
        }catch (error) {
            console.error(error);
        }
    }
}