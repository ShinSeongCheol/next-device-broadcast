import 'server-only'

import {SshHandler, TelnetHandler} from "@/src/lib/executor/handler";
import {Config} from "@/src/lib/executor/types";

export class Executor {
    private sshHandler = new SshHandler();
    private telnetHandler = new TelnetHandler();

    async execute(config: Config, command:string): Promise<string | undefined> {
        switch (config.protocol) {
            case "SSH":
                return await this.sshHandler.execute(config, command);
            case "TELNET":
                return await this.telnetHandler.execute(config, command);
            default:
                throw new Error(`지원하지 않는 프로토콜: ${config.protocol}`)
        }
    }
}