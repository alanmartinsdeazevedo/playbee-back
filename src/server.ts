import { app } from "./app";

app.listen({
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 3003
}).then(() => {
    console.log('🚀 HTTP Server Running!')
})