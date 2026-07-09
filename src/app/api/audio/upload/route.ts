import {NextRequest, NextResponse} from "next/server";
import {uploadAudio} from "@/src/app/services/audio";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

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

        const {originalName, uuid} = await uploadAudio(file);

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