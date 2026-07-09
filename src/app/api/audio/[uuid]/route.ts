import {NextRequest, NextResponse} from "next/server";
import {getAudioInfo} from "@/src/app/services/audio";

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

        const {fileBuffer, fallbackFileName, originalFileName} = await getAudioInfo(uuid);

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `inline; filename="${fallbackFileName}"; filename*=UTF-8''${originalFileName}`,
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