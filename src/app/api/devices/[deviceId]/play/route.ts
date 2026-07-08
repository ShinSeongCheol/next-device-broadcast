import {NextRequest, NextResponse} from "next/server";

type RouteContext = {
    params: Promise<{
        deviceId: string;
    }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
    const { deviceId } = await context.params;

    console.log(deviceId)

    return NextResponse.json({});
}