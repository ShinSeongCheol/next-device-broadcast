import {Client as SshClient} from "ssh2";
import {Telnet as TelnetClient} from "telnet-client";
import {Config} from "@/src/lib/executor/types";

export class SshHandler {
    async execute(config: Config, command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const conn = new SshClient();

            conn.connect({
                host: config.host,
                port: config.port,
                username: config.username,
                password: config.password,
            })

            conn.on('ready', () => {
                conn.exec(command, (err, stream) => {
                    if (err) {
                        conn.end();
                        reject(err);
                    }

                    let output = '';
                    stream.on('data', (d: string) => output += d.toString());
                    stream.on('close', () => {
                        conn.end();
                        resolve(output);
                    })
                })
            });

            conn.on('error', reject);

        })
    }
}

export class TelnetHandler {
    async execute(config: Config, command: string): Promise<string|undefined> {
        const conn = new TelnetClient();
        try {
            await conn.connect({
                host: config.host,
                port: config.port,
                username: config.username,
                password: config.password,
            });
            const response = await conn.exec(command);
            await conn.end();
            return response;
        }catch (error) {
            console.error(error)
            await conn.end();
        }
    }
}