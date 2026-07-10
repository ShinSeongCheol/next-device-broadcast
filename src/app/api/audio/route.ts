import {NextRequest, NextResponse} from "next/server";
import {getAudioList} from "@/src/repository/audio";

export async function GET(req:NextRequest) {

    const audioList = await getAudioList();

    return NextResponse.json(audioList)
}