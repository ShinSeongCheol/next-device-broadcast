import {mkdir, readFile, writeFile} from "fs/promises";
import crypto from "crypto";
import path from "path";
import {createAudio, getAudio} from "@/src/lib/server/prisma";

const AUDIO_DIR = path.join(process.cwd(), "storage", "audio");

function safeOriginalName(name: string) {
    return name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
}

function encodeRFC5987Value(value: string) {
    return encodeURIComponent(value).replace(/['()*]/g, (char) =>
        `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

export async function getAudioInfo(uuid: string) {
    const audio = await getAudio(uuid);
    if (!audio) {
        throw new Error(`오디오 파일을 찾을 수 없습니다.`);
    }

    const filePath = path.join(audio.path, `${audio.uuid}${audio.extension}`);
    const fileBuffer = await readFile(filePath);

    const fallbackFileName = `${audio.uuid}${audio.extension}`;
    const originalFileName = encodeRFC5987Value(`${audio.name}${audio.extension}`);

    return {fileBuffer, fallbackFileName, originalFileName}
}

export async function uploadAudio(file: File) {
    try {
        await mkdir(AUDIO_DIR, { recursive: true });

        const ext = ".mp3";
        const uuid = crypto.randomUUID();
        const originalName = safeOriginalName(file.name);
        const savedFileName = `${uuid}${ext}`;
        const savedPath = path.join(AUDIO_DIR, savedFileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(savedPath, buffer);

        await createAudio({uuid: uuid, name: originalName, path: AUDIO_DIR, extension: ext});

        return {originalName, uuid}
    }catch (error) {
        console.error(error);
        throw new Error("파일 업로드 중 에러 발생", {cause: error})
    }
}