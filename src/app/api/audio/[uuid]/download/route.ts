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

function encodeRFC5987Value(value: string) {
    return encodeURIComponent(value).replace(/['()*]/g, (char) =>
        `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
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
    const fileBuffer = await readFile(filePath);

    const fallbackFileName = `${audio.uuid}${audio.extension}`;
    const originalFileName = `${audio.name}${audio.extension}`;

    return new Response(fileBuffer, {
        headers: {
            "Content-Type": "audio/mpeg",
            "Content-Disposition": `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${encodeRFC5987Value(originalFileName)}`,
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