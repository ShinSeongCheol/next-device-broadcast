import 'server-only'

import {Telnet} from "telnet-client";
import {telnetOption} from "@/src/lib/server/types";

export function getTelnetOption(telnetOption?: telnetOption){
    return {
        host: telnetOption?.host || "192.168.0.99",
        port: telnetOption?.port || 23,
        username: telnetOption?.username || "root",
        password: telnetOption?.password || "tksemf"
    }
}

export async function execTelnetCommand(option: telnetOption, command:string) {
    const connection = new Telnet()

    try {

        await connection.connect({
            host: option.host,
            port: option.port,
            username: option.username,
            password: option.password,
            loginPrompt: /login[: ]*$/i,
            passwordPrompt: /Password: /i,
            shellPrompt: /[#>$]\s*$/,
            timeout: 10000,
            execTimeout: 50000,
            ors: "\r\n",
            irs: "\r\n",
        })

        return String(await connection.exec(command))

    }catch (error) {
        throw new Error("Telnect Command 실패" , {cause: error})
    }finally {
        try {
            await connection.end()
        }catch {
            try {
                await connection.destroy()
            }catch {}
        }
    }
}