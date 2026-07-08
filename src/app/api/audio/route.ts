import {NextRequest, NextResponse} from "next/server";
import {getAudioList} from "@/src/lib/server/prisma";

export async function GET(req:NextRequest) {

    const audioList = await getAudioList();

    return NextResponse.json(audioList)
}