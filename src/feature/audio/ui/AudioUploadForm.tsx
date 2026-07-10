'use client';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Field, FieldGroup} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {uploadAudioAction, UploadAudioState} from "@/src/feature/audio/actions";
import Form from "next/form";
import React, {useActionState} from "react";
import {Progress, ProgressLabel, ProgressValue} from "@/components/ui/progress";

export default function AudioUploadForm() {
    const [open, setOpen] = React.useState(false);
    const [progress, setProgress] = React.useState<number>(0);

    const [state, formAction, isPending] = useActionState(
        async (prevState: UploadAudioState, formData:FormData) => {
            const files = formData.getAll('files') as File[];

            let uploadFileCount = 0;
            let progress = 0;
            for (const file of files) {
                if (!file || file.size === 0) continue;

                await uploadAudioAction(prevState, file);
                uploadFileCount++;
                progress = Math.round((uploadFileCount / files.length) * 100)
                setProgress(progress);
            }

            setOpen(false)
            return {
                progress: progress,
                success: true,
                message: "",
            };

        }, {progress: 0, success:false, message: ""})

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline">파일 추가</Button>}/>
            <DialogContent className="sm:max-w-sm">
                <Form action={formAction} className={'space-y-4'}>
                    <DialogHeader>
                        <DialogTitle>파일 업로드</DialogTitle>
                        <DialogDescription>
                            파일 버튼을 눌러 음악 파일을 추가해주세요.
                        </DialogDescription>
                    </DialogHeader>

                    {isPending && (
                        <Progress value={progress}>
                            <ProgressLabel>업로드 중</ProgressLabel>
                            <ProgressValue />
                        </Progress>
                    )}

                    {!isPending && (
                        <>
                            <FieldGroup>
                                <Field>
                                    <Input name="files" multiple={true} type={'file'}/>
                                </Field>
                            </FieldGroup>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" type={"button"}>취소</Button>}/>
                                <Button type={"submit"}>저장</Button>
                            </DialogFooter>
                        </>
                    )}

                </Form>
            </DialogContent>
        </Dialog>
    )
}