import {AudioItem, AudioUploadForm} from "@/src/feature/audio";
import {getAudioList} from "@/src/repository/audio";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function AudioPage() {

    const audioList = await getAudioList()

    return (
        <div className={'flex flex-col gap-4'}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link href="/" />}>홈</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>음악</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap items-center justify-end">
                <AudioUploadForm/>
            </div>

            <div className={'flex flex-col gap-4 max-w-xl'}>
                {audioList.map((item) => (
                    <AudioItem key={item.id} id={item.id} name={item.name} path={item.path} createdAt={item.createdAt}
                               updatedAt={item.updatedAt} uuid={item.uuid} extension={item.extension} />
                ))}
            </div>
        </div>
    )
}