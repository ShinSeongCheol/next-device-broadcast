import {mkdir, readFile, writeFile} from "fs/promises";
import crypto from "crypto";
import path from "path";
import {createAudio, getAudio} from "@/src/repository/audio";
import {spawn} from "node:child_process";
import {Readable} from "node:stream";
import {parseBuffer} from "music-metadata";

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
    const audioFile = await readFile(filePath);

    const fallbackFileName = `${audio.uuid}${audio.extension}`;
    const originalFileName = encodeRFC5987Value(`${audio.name}${audio.extension}`);

    return {audioFile, fallbackFileName, originalFileName}
}

export async function uploadAudio(file: File) {
    try {
        await mkdir(AUDIO_DIR, { recursive: true });

        const ext = file.name.substring(file.name.lastIndexOf("."), file.name.length);
        const uuid = crypto.randomUUID();
        const originalName = safeOriginalName(file.name.substring(0, file.name.lastIndexOf(".")));
        const savedFileName = `${uuid}${ext}`;
        const savedPath = path.join(AUDIO_DIR, savedFileName);

        const buffer = Buffer.from(await file.arrayBuffer());

        const metadata = await parseBuffer(buffer, file.type);
        console.log(metadata);

        await writeFile(savedPath, buffer);

        await createAudio({uuid: uuid, name: originalName, path: AUDIO_DIR, extension: ext});

        return {originalName, uuid}
    }catch (error) {
        console.error(error);
        throw new Error("파일 업로드 중 에러 발생", {cause: error})
    }
}

export async function streamToWav(uuid: string): Promise<Readable> {
    const audio = await getAudio(uuid);
    if (!audio) {
        throw new Error(`오디오 파일을 찾을 수 없습니다.`);
    }

    const inputPath = path.join(audio.path, `${audio.uuid}${audio.extension}`);

    const ffmpegPath = (process.env.FFMPEG_PATH || "") + "/ffmpeg";

    const ffmpeg = spawn(ffmpegPath, [
        "-i", inputPath,
        "-f", "wav",
        "-acodec", "pcm_s16le",
        "-ar", "44100",
        "-ac", "2",
        "pipe:1"
    ]);

    ffmpeg.stderr.on("data", (data) => {
        console.log(data.toString());
    });

    return ffmpeg.stdout;
}