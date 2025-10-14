import express from 'express';
import { config } from 'dotenv';
import { router } from './interfaces/http/routes';

config();

const app = express();
app.use(express.json());
app.use('/api', router);

const PORT = process.env.APPLICATION_PORT_PROVIDER || 3001;

app.listen(PORT, async () => {
  console.info({ apiServer: `started at port: ${PORT}` });
});
