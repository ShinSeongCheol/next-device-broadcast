import { WebSocketServer } from 'ws';
import { Client } from 'ssh2';
import {selectDevice} from "@/src/repository/device";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const deviceId = url.searchParams.get('deviceId');

    const device = await selectDevice(Number(deviceId));

    if (!device) {
        ws.send('Error: 장비 ID가 없습니다.\r\n');
        return ws.close();
    }

    ws.send(`[System] ${device.ip}.${device.port} 장비에 연결 중...\r\n`);

    const conn = new Client();

    conn.on('ready', () => {
        ws.send('[System] 인증 성공! 쉘 세션을 시작합니다.\r\n');

        conn.shell({ term: 'xterm-color' }, (err, stream) => {
            if (err) {
                ws.send(`[System] 쉘 실행 실패: ${err.message}\r\n`);
                return ws.close();
            }

            stream.on('data', (data: Buffer) => ws.send(data.toString()));

            ws.on('message', (msg) => stream.write(msg.toString()));

            stream.on('close', () => {
                ws.send('\r\n[System] 세션이 종료되었습니다.\r\n');
                conn.end();
                ws.close();
            });
        });
    }).on('error', (err) => {
        ws.send(`\r\n[System] SSH 연결 에러: ${err.message}\r\n`);
        ws.close();
    }).connect({
        host: device.ip,
        port: 22,
        username: device.username ?? undefined,
        password: device.password ?? undefined,
        readyTimeout: 10000
    });

    ws.on('close', () => conn.end());
});