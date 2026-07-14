'use client'

import Form from "next/form";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel, FieldLegend, FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Server} from "lucide-react";
import {createDeviceAction} from "@/src/feature/device/actions";
import {useRouter} from "next/navigation";
import React, {useTransition} from "react";

export default function DeviceForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                await createDeviceAction(formData);
                router.back();
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("장비 저장 중 오류가 발생했습니다.");
            }
        });
    };

    return (
            <div className="w-full max-w-xl">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
                                <Server />
                            </div>

                            <div>
                                <h1 className="text-xl font-semibold tracking-tight text-neutral-950">
                                    장비 등록
                                </h1>
                                <p className="mt-1 text-sm leading-6 text-neutral-500">
                                    네트워크에 연결할 장비의 기본 정보와 관리자 계정을
                                    입력해 주세요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Form onSubmit={handleSubmit} action={createDeviceAction} className="px-6 py-7 sm:px-8 sm:py-8">
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>기본정보</FieldLegend>
                                <FieldDescription>장비를 식별하고 연결하기 위한 정보를 입력합니다.</FieldDescription>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor={"name"}>장비명</FieldLabel>
                                        <Input id={"name"} name={"name"} type={"text"} autoComplete={'off'} placeholder={'예: 회의실 IP 스피커'} required={true}></Input>
                                        <FieldDescription>목록에서 쉽게 구분할 수 있는 이름을 입력하세요.</FieldDescription>
                                    </Field>
                                    <div className={'grid grid-cols-2 gap-4'}>
                                        <Field>
                                            <FieldLabel htmlFor="ip">IP 주소</FieldLabel>
                                            <Input id="ip" name="ip" type="text" inputMode="decimal" autoComplete="off" placeholder="192.168.0.100" required={true}/>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="port">포트</FieldLabel>
                                            <Input id="port" name="port" type="number" inputMode="numeric" min={1} max={65535} autoComplete="off" placeholder="22" required={true}/>
                                        </Field>
                                    </div>
                                </FieldGroup>
                            </FieldSet>
                            <FieldSeparator/>
                            <FieldSet>
                                <FieldLegend>관리자 인증</FieldLegend>
                                <FieldDescription>장비에 접속할 때 사용할 관리자 계정을 입력합니다.</FieldDescription>
                                <FieldGroup>
                                    <div className={'grid grid-cols-2 gap-4'}>
                                        <Field>
                                            <FieldLabel htmlFor={'username'}>관리자 계정</FieldLabel>
                                            <Input id={"username"} name={"username"} type={"text"} autoComplete={'off'} placeholder={'admin'} required={true}></Input>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor={'password'}>비밀번호</FieldLabel>
                                            <Input id={"password"} name={"password"} type={"password"} autoComplete={'off'} placeholder={'•••••••'} required={true}></Input>
                                        </Field>
                                    </div>
                                </FieldGroup>
                            </FieldSet>
                            <Field orientation={"horizontal"} className={'flex items-center justify-end'}>
                                <Button variant="outline" type="button" onClick={() => router.back()}>취소</Button>
                                <Button type="submit">{isPending ? "저장 중..." : "저장"}</Button>
                            </Field>
                        </FieldGroup>
                    </Form>
                </div>
            </div>
    );
}