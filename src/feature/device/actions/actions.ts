'use server';
import {createDevice} from "@/src/service/device";
import {revalidatePath} from "next/cache";

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