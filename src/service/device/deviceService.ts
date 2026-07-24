import {
    deleteDevice,
    insertDevice,
    selectDevice,
    selectDeviceList, selectDeviceMixerControl, selectDeviceMixerControls,
    updateDeviceHealth, updateDeviceMixerControl,
    upsertDeviceAudioCard,
    upsertDeviceMixerControls
} from "@/src/repository/device";
import {selectDeviceDetailList} from "@/src/repository/device/deviceRepository";
import {Executor} from "@/src/lib/executor";

export async function getDevice(deviceId:number) {
    return await selectDevice(deviceId);
}

export async function getDeviceList() {
    return  await selectDeviceList();
}

export async function getDeviceDetail() {
    return await selectDeviceDetailList();
}

export async function updateHealth(deviceId: number) {

    const device = await getDevice(deviceId);
    if (!device) {
        throw new Error("장비를 찾지 못했습니다.");
    }

    try {

        const config = {
            protocol: device.service.toUpperCase(),
            host: device.ip,
            port: device.port,
            username: device.username || '',
            password: device.password || '',
        }

        const executor = new Executor();
        const rawSoundCardCommand = 'cat /proc/asound/cards | sed -nE \'s/^[[:space:]]*([0-9]+).* - (.*)$/\\1 \\2/p\'';
        const rawMixerStatusCommand = 'amixer scontents';

        const rawSoundCards = await executor.execute(config, rawSoundCardCommand);
        const rawMixerStatus = await executor.execute(config, rawMixerStatusCommand);

        if (!rawSoundCards || !rawMixerStatus) {
            throw new Error("장비 응답이 없거나 사운드 설정이 비어있습니다.");
        }

        // 사운드 카드
        const soundCardLines = rawSoundCards.split('\n').map(l => l.trim()).filter(Boolean);
        const regex = /^(\d+)\s+(.+)$/;

        const cardMatch = soundCardLines[0]?.match(regex);
        if (!cardMatch) {
            throw new Error("사운드카드 포맷 파싱 실패.");
        }

        const cardIndex = parseInt(cardMatch[1], 10);
        const cardName = cardMatch[2];

        await updateDeviceHealth({ deviceId: Number(deviceId), status: "NORMAL" });
        const deviceAudioCard = await upsertDeviceAudioCard({
            deviceId: Number(deviceId),
            cardIndex: cardIndex,
            name: cardName
        });

        const mixerBlockRegex = /Simple mixer control '([^']+)'[\s\S]*?Front Left:[^\n]*?\[(\d+)%\]/g;
        let mixerMatch;

        while ((mixerMatch = mixerBlockRegex.exec(rawMixerStatus)) !== null) {
            const mixerControlName = mixerMatch[1];
            const volume = mixerMatch[2]

            await upsertDeviceMixerControls({
                audioCardId: Number(deviceAudioCard.id),
                name: mixerControlName,
                volume: volume
            });
        }

        return rawSoundCards;

    } catch (error) {
        console.error(`[Health Check Error] Device ID ${deviceId}:`, error);

        try {
            await updateDeviceHealth({ deviceId: Number(deviceId), status: "ERROR" });
        } catch (dbError) {
            console.error("장비 에러 상태 DB 반영 실패:", dbError);
        }
        throw new Error(`[${device.ip}]: ${device.name} 장비와 통신 오류 발생`, { cause: error });
    }
}

export async function getDeviceVolume(deviceId:number, audioCardId:number) {
    return await selectDeviceMixerControls({deviceId, audioCardId});
}

export async function updateDeviceVolume(deviceId:number, mixerControlId:number, volume:string) {
    const device = await getDevice(deviceId);
    if (!device) {
        throw new Error("장비를 찾지 못했습니다.");
    }


    const mixerControl = await selectDeviceMixerControl({mixerControlId: Number(mixerControlId)});
    if (!mixerControl) {
        throw new Error("장비가 없습니다.");
    }

    const config = {
        protocol: device.service.toUpperCase(),
        host: device.ip,
        port: device.port,
        username: device.username || '',
        password: device.password || '',
    }

    const command = `amixer sset ${mixerControl.name} ${volume}%`;

    const executor = new Executor();
    const res = executor.execute(config, command);

    if (!res) {
        throw new Error("장비 응답이 없습니다.");
    }

    return await updateDeviceMixerControl({mixerControlId: mixerControlId, volume: volume})
}

export async function createDevice(params : {name: string, ip: string, service:string, port: number, username: string, password:string}) {
    await insertDevice(params);
}

export async function removeDevice(deviceId:number) {
    await deleteDevice(deviceId);
}