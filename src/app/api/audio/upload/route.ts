import {NextRequest, NextResponse} from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import {createAudio} from "@/src/lib/server/prisma";

const AUDIO_DIR = path.join(process.cwd(), "storage", "audio");
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function safeOriginalName(name: string) {
    return name.replace(/[^a-zA-Z0-9가-힣._-]/g, "_");
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "file이 없습니다." },
                { status: 400 }
            );
        }

        if (!file.name.toLowerCase().endsWith(".mp3")) {
            return NextResponse.json(
                { message: "MP3 파일만 업로드할 수 있습니다." },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: "파일 용량이 너무 큽니다." },
                { status: 400 }
            );
        }

        await mkdir(AUDIO_DIR, { recursive: true });

        const ext = ".mp3";
        const uuid = crypto.randomUUID();
        const originalName = safeOriginalName(file.name);
        const savedFileName = `${uuid}${ext}`;
        const savedPath = path.join(AUDIO_DIR, savedFileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(savedPath, buffer);

        await createAudio({uuid: uuid, name: originalName, path: AUDIO_DIR, extension: ext});

        return NextResponse.json({
            originalName,
            uuid,
            downloadUrl: `/api/audio/${uuid}`,
        });
    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { status: 500 }
        );
    }
}