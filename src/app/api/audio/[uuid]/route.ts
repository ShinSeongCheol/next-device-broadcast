import {NextRequest, NextResponse} from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {getAudio} from "@/src/lib/server/prisma";

type RouteContext = {
    params: Promise<{
        uuid: string;
    }>;
};

function isSafeFileName(uuid: string) {
    return /^[a-zA-Z0-9._-]/.test(uuid);
}

function contentDispositionInline(fileName: string, fallbackFileName: string) {
    const encodedFileName = encodeURIComponent(fileName);

    return `inline; filename="${fallbackFileName}"; filename*=UTF-8''${encodedFileName}`;
}

export async function GET(_req: NextRequest, context: RouteContext) {
    try{
    const {uuid} = await context.params;

    if (!isSafeFileName(uuid)) {
        return NextResponse.json(
            { message: "잘못된 파일명입니다." },
            { status: 400 }
        );
    }

    const audio = await getAudio(uuid);
    if (!audio) {
        return NextResponse.json(
            { message: "잘못된 파일명입니다." },
            { status: 404 }
        );
    }

    const filePath = path.join(audio.path, `${audio.uuid}${audio.extension}`);
    console.log(filePath)
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
        headers: {
            "Content-Type": "audio/mpeg",
            "Content-Disposition": contentDispositionInline(
                audio.name,
                `${audio.uuid}.mp3`
            ),
            "Cache-Control": "no-store",
        },
    });

    } catch(error) {
        console.error(error);
        return NextResponse.json(
            { message: "파일을 찾을 수 없습니다." },
            { status: 404 }
        );
}
}