import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {getDeviceList} from "@/src/service/device";
import {Badge} from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {DeviceCard} from "@/src/feature/device";

export default async function devicePage() {

    const deviceList = await getDeviceList();

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

            <div className={'grid grid-cols-4 gap-4'}>
                {deviceList.map((device) => {
                    return (
                        <Card key={device.id}>
                            <CardHeader>
                                <CardTitle>{device.name}</CardTitle>
                                <CardDescription className={''}>{device.ip}</CardDescription>
                                <CardAction>{device.healthStatus === 'NORMAL' ? <Badge variant={'outline'}>정상</Badge>:<Badge variant={'destructive'}>오류</Badge>}</CardAction>
                            </CardHeader>

                            <CardContent>
                                <p>{device.lastHealthTime?.toLocaleString()}</p>
                            </CardContent>

                            <CardFooter className={'flex flex-col items-start'}>
                                <p>생성일 : {device.createdAt.toLocaleString()}</p>
                                <p>수정일 : {device.updatedAt.toLocaleString()}</p>
                            </CardFooter>
                        </Card>
                    )
                })
                }
            </div>
        </div>
    )
}