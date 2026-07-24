'use server';

import {removeAudio, uploadAudio} from "@/src/service/audio";
import {UploadAudioState} from "@/src/feature/audio/actions/types";
import { revalidatePath } from "next/cache";


export async function uploadAudioAction(prevState: UploadAudioState, file: File):Promise<UploadAudioState> {
    await uploadAudio(file);
    revalidatePath('/audio');

    return {
        success: true,
        message: ""
    }
}

export async function deleteAudioAction(uuid:string) {
    await removeAudio(uuid);
    revalidatePath('/audios');
}