import { Request, Response } from 'express';

export class ApiStatusController {
    async apiStatus(req: Request, res: Response) {
        const today = new Date().toLocaleString("nl-BE", { timeZone: "Europe/Brussels"});
        const status = 'onfire';

        return res.json({
            status: status,
            api: `app+`, Date: `${today}`
        })
    }
}