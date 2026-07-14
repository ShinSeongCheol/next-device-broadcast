'use client';

import {
    Sidebar,
    SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
    SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {usePathname} from "next/navigation";

export default function AppSideBar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarContent>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        플랫폼
                    </SidebarGroupLabel>

                    <SidebarGroupContent>

                        <SidebarMenu>
                            <Collapsible render={
                                <SidebarMenuItem>
                                    <CollapsibleTrigger render={
                                        <SidebarMenuButton>
                                            <span>설정</span>
                                        </SidebarMenuButton>
                                    }>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton isActive={pathname === '/devices'} render={
                                                    <Link href={'/devices'}>장비</Link>
                                                }>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton isActive={pathname === '/audios'} render={
                                                    <Link href={'/audios'}>오디오 보관함</Link>
                                                }>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                    <SidebarMenuBadge>
                                        <ChevronDown size={16}/>
                                    </SidebarMenuBadge>
                                </SidebarMenuItem>
                            }>
                            </Collapsible>
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

        </Sidebar>
    )
}