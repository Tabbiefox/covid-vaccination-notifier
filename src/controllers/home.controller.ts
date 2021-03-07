import { config } from '../config';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import createError from 'http-errors';

export function index(req: Request, res: Response, next: NextFunction) {
    let filePath = config.dataDir + 'covid.json';
    let jsonData: any = {};
    if (fs.existsSync(filePath))
    {
        try {
            let data = fs.readFileSync(filePath);
            if (data.length > 0) {
                jsonData = JSON.parse(data.toString());
            }
        }
        catch (err) {
            console.error('HomeIndexController: Error fetching ' + filePath);
        }
    }
    res.json(jsonData);
}