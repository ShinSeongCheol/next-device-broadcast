import {NextRequest, NextResponse} from "next/server";
import {getAudioDetail} from "@/src/service/audio";
import * as fs from "node:fs";
import path from "path";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const audioId = searchParams.get('audioId');

    if (!audioId) {
        return new NextResponse('', {status: 400});
    }

    const audioDetail = await getAudioDetail(Number(audioId))

    if (!audioDetail) {
        return new NextResponse('', {status: 400});
    }

    const picturePath = audioDetail.audioCommon?.picturePath;
    if (!picturePath) {
        return new NextResponse('', {status: 400});
    }
    const fileBuffer = fs.readFileSync(picturePath)
    const ext = path.extname(picturePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}