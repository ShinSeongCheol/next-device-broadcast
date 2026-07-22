'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import "@xterm/xterm/lib/xterm.js";
import {useEffect, useLayoutEffect, useRef} from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import {AttachAddon} from "@xterm/addon-attach";

interface Props {
    isTerminalOpen: boolean;
    setIsTerminalOpen: (isOpen: boolean) => void;
    deviceId: number;
}

export default function DeviceTerminal({isTerminalOpen, setIsTerminalOpen, deviceId}: Props) {
    return (
        <Dialog
            open={isTerminalOpen}
            onOpenChange={setIsTerminalOpen}
        >
            <DialogContent className="p-0 gap-0 min-w-160">
                <DialogHeader className="p-4">
                    <DialogTitle>
                        터미널
                    </DialogTitle>
                </DialogHeader>

                <TerminalView deviceId={deviceId}/>
            </DialogContent>
        </Dialog>
    );
}

function TerminalView({deviceId}: {deviceId:number}) {

    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        const ws = new WebSocket(`ws://localhost:8080?deviceId=${deviceId}`);
        const attachAddon = new AttachAddon(ws);
        term.loadAddon(attachAddon)

        term.open(terminalRef.current);
        fitAddon.fit()

        return () => {
            term.dispose();
            ws.close()
        }
    }, [])

    return (
        <div
            ref={terminalRef}
            className="w-full h-full min-h-72 p-4 bg-neutral-950 rounded-b-xl overflow-hidden"
        />
    )
}