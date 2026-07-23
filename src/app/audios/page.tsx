import {AudioColumns, AudioUploadForm, DataTable} from "@/src/feature/audio";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {getAudioDetailList} from "@/src/service/audio";

export default async function AudioPage() {

    const data = await getAudioDetailList();

    return (
        <div className={'flex flex-col gap-4 p-4'}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link href="/" />}>홈</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>오디오 보관함</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap items-center justify-end">
                <AudioUploadForm/>
            </div>

            <DataTable columns={AudioColumns} data={data} />
        </div>
    )
}