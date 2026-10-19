import { createApp } from './app.mjs';

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be between 0 and 65535.');
const host = process.env.HOST ?? '127.0.0.1';
if (!['127.0.0.1','localhost','::1'].includes(host)) throw new Error('This local application must bind to a loopback address. Set HOST to 127.0.0.1, localhost or ::1.');
const app = createApp({ onError: error => console.error('Request failed:', error.message) });
app.server.once('error',async error=>{
  console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Choose another PORT and start again.`:'The local server could not start. Check the configured host and port.');
  await app.close();
  process.exitCode=1;
});
app.server.listen(port,host,() => console.log(`AXIORYN AI is ready at http://${host === '::1'?'[::1]':host}:${app.server.address().port}\nMode: local workspace. External sales delivery is disabled. Optional AI requests require owner confirmation.`));
for (const signal of ['SIGINT','SIGTERM']) process.once(signal,() => app.close().then(()=>process.exit(0)));
