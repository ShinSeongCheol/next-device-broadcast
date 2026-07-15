import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {DeviceCard, RefreshButton} from "@/src/feature/device";
import {getDeviceDetail} from "@/src/service/device/deviceService";
import {PackagePlus, RotateCw} from "lucide-react";

export default async function devicePage() {

    const deviceList = await getDeviceDetail();

    return (
        <div className={'flex flex-col gap-4 p-4'}>
            <Breadcrumb className={''}>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink render={<Link href="/" />}>홈</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            장비
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className={'flex items-center justify-end gap-4'}>
                <RefreshButton deviceIdList={deviceList.map((device) => device.id)}/>
                <Link href={'/devices/new'}>
                    <Button variant={'outline'}><PackagePlus/>장비 추가</Button>
                </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                {deviceList.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    )
}