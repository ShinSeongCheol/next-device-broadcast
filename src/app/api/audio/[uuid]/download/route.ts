import {NextRequest, NextResponse} from "next/server";
import {getAudioInfo} from "@/src/app/_services/audio";

type RouteContext = {
    params: Promise<{
        uuid: string;
    }>;
};

function isSafeFileName(uuid: string) {
    return /^[a-zA-Z0-9._-]/.test(uuid);
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

        const {audioFile, fallbackFileName, originalFileName} = await getAudioInfo(uuid);

        return new Response(audioFile, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `attachment; filename="${fallbackFileName}"; filename*=UTF-8''${originalFileName}`,
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