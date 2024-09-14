import express from 'express';
import { router } from './routes';

const app = express();
app.use('/api', router);

const PORT = 3000;

app.listen(PORT, async () => {
    console.info({ apiServer: `started at port: ${PORT}`})
});