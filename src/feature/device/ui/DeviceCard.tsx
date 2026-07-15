'use client';

import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Device} from "@/src/repository/device";
import {Badge} from "@/components/ui/badge";
import {LockKeyholeIcon, MoreHorizontalIcon, RefreshCw, User2Icon} from "lucide-react";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Slider} from "@/components/ui/slider";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";

interface Props {
    device: Device;
}

export default function DeviceCard({device}: Props) {

    const isNormal = device.healthStatus === 'NORMAL';
    const [volume, setVolume] = useState(50);

    const handleVolumeChange = (volume: number | readonly number[]) => {
        setVolume(volume as number);
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
                        <Select disabled={!isNormal}>
                            <SelectTrigger>
                                <SelectValue placeholder={'사운드장치'}></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem>
                                        Headphone
                                    </SelectItem>
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