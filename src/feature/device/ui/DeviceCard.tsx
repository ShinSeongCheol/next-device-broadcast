'use client';

import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {DeviceDetail} from "@/src/repository/device";
import {Badge} from "@/components/ui/badge";
import {LockKeyholeIcon, MoreHorizontalIcon, RefreshCw, User2Icon} from "lucide-react";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Slider} from "@/components/ui/slider";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";

interface Props {
    device: DeviceDetail;
}

export default function DeviceCard({device}: Props) {

    const audioCards = device.audioCards;
    const mixerControls = audioCards?.[0]?.mixerControls;

    const isNormal = device.healthStatus === 'NORMAL';
    const [volume, setVolume] = useState<number>(Number(mixerControls?.[0].volume ?? 50));


    const handleVolumeChange = (volume: number | readonly number[]) => {
        setVolume(volume as number);
    }

    const handleMixerControlChange = (value: string | null) => {
        const volume =  mixerControls?.find(mixerControl => mixerControl.id === Number(value))?.volume;
        if (!volume) return;

        setVolume(Number(volume));
    }

    return (
        <Card>
            <CardHeader className={'gap-2'}>
                <CardTitle className="flex gap-4">
                    {
                        isNormal ? <Badge variant={'outline'}>정상</Badge> : <Badge variant={'destructive'}>오류</Badge>
                    }
                    <span>
                        {device.name}
                    </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1 font-mono text-xs">
                    <span className="text-neutral-500">{device.ip}</span>
                    <span className="text-neutral-300">:</span>
                    <span className="text-neutral-500">{device.port}</span>
                </CardDescription>
                <CardAction>
                    <MoreHorizontalIcon/>
                </CardAction>
            </CardHeader>
            <CardContent className={''}>
                <FieldGroup className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel className={'text-xs'}>계정</FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <User2Icon/>
                            </InputGroupAddon>
                            <InputGroupInput type={'text'} value={device.username || ''} disabled={true}/>
                        </InputGroup>
                    </Field>
                    <Field>
                        <FieldLabel className={'text-xs'}>비밀번호</FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockKeyholeIcon/>
                            </InputGroupAddon>
                            <InputGroupInput type={'password'} value={device.password || ''} disabled={true}/>
                        </InputGroup>
                    </Field>
                    <Field className={'col-span-2'}>
                        <Select defaultValue={mixerControls?.[0].name} onValueChange={handleMixerControlChange} disabled={!isNormal} items={mixerControls?.map(mixerControl => {
                            return {
                                label: mixerControl.name,
                                value: mixerControl.id
                            }
                        })}>
                            <SelectTrigger>
                                <SelectValue placeholder={'사운드장치'}></SelectValue>
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={true}>
                                <SelectGroup>
                                    {mixerControls?.map((mixerControl) => (
                                        <SelectItem key={mixerControl.id} value={mixerControl.id}>
                                            {mixerControl.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="col-span-2">
                        <FieldLabel className={'text-xs'}>볼륨 {volume}%</FieldLabel>
                        <Slider defaultValue={[50]} value={[volume]} max={100} step={1} disabled={!isNormal} onValueChange={handleVolumeChange}></Slider>
                    </Field>
                </FieldGroup>
            </CardContent>
            <CardFooter className={'text-xs flex items-center gap-2'}>
                <RefreshCw size={16}/>
                <span>
                    갱신시간 : {new Date(device.lastHealthTime || '').toLocaleString('ko-kr', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                })}
                </span>
            </CardFooter>
        </Card>
    );
}