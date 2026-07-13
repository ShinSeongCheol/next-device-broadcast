import {mkdir, readFile, writeFile} from "fs/promises";
import crypto from "crypto";
import path from "path";
import {AudioDetail, createAudio, getAudio} from "@/src/repository/audio";
import {spawn} from "node:child_process";
import {Readable} from "node:stream";
import {parseBuffer} from "music-metadata";
import {
    createAudioCommon,
    createAudioFormat,
    selectAudioDetails
} from "@/src/repository/audio/audioRepository";

const AUDIO_DIR = path.join(process.cwd(), "storage", "audio");
const AUDIO_COVER_DIR = path.join(process.cwd(), "storage", "audio", "cover");

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
        // 파일저장
        await writeFile(savedPath, buffer);
        // meta 정보 조회
        const metadata = await parseBuffer(buffer, file.type);

        // 앨범 이미지 저장
        const pictures = metadata.common.picture;
        let coverImage = null;
        if (pictures && pictures.length > 0) {
            coverImage = pictures.find(p => p.type === 'Cover (front)')
            if (!coverImage) {
                coverImage = pictures[0];
            }
        }

        let uploadPath = undefined;
        if (coverImage) {
            const coverImageExt = coverImage.format.split('/')[1] || 'jpg';
            const coverImageFileName = `${uuid}.${coverImageExt}`;

            await mkdir(AUDIO_COVER_DIR, { recursive: true });
            uploadPath = path.join(AUDIO_COVER_DIR, coverImageFileName);
            await writeFile(uploadPath, coverImage.data);
        }


        const audio = await createAudio({uuid: uuid, name: originalName, path: AUDIO_DIR, extension: ext});
        // audio Format 정보 추가
        await createAudioFormat({
            audioId: audio.id,
            container: metadata.format?.container,
            bitrate: metadata.format?.bitrate,
            codec: metadata.format?.codec,
            duration: metadata.format?.duration,
            numberOfChannels: metadata.format?.numberOfChannels,
            sampleRate: metadata.format?.sampleRate,
            });

        // audio common 정보 추가
        await createAudioCommon({
            audioId: audio.id,
            title: metadata.common?.title,
            artist: metadata.common?.artist,
            album: metadata.common?.artist,
            year: metadata.common?.year,
            picturePath: uploadPath
        });

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

export async function getAudioDataTable(): Promise<AudioDetail[]> {
    return await selectAudioDetails();
}