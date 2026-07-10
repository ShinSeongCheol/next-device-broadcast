import {NextRequest, NextResponse} from "next/server";
import {getAudioInfo, streamToWav} from "@/src/service/audio";

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

        const wavStream = await streamToWav(uuid);

        return new Response(wavStream as never, {
            headers: {
                "Content-Type": "audio/wav",
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