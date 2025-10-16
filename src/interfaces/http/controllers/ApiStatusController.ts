import { Request, Response } from 'express';

export class ApiStatusController {
  public async apiStatus(req: Request, res: Response): Promise<Response> {
    const today = new Date().toLocaleString('nl-BE', {
      timeZone: 'Europe/Brussels',
    });

    return res.json({
      status: 'onfire',
      api: 'app+',
      date: today,
    });
  }
}
