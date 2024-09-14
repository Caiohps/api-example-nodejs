import express from 'express';
import { router } from './routes';
import{ config } from 'dotenv';

config();

const app = express();
app.use('/api', router);

const PORT = process.env.APPLICATION_PORT_PROVIDER || 3001;

app.listen(PORT, async () => {
    console.info({ apiServer: `started at port: ${PORT}`})

});