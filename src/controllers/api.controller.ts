import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import * as fs from 'fs';
import { config } from '../config';
import { getProviders } from '../app';

export function getCovidApiDemo(req: Request, res: Response, next: NextFunction) {
    let filePath = config.dataDir + 'covidApiDemo.json';
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
            return next(createError(500, 'Unable to load CovidApiDemo data'));
        }
    }
    res.json(jsonData);
}

export function getRegions(req: Request, res: Response, next: NextFunction) {
    const result = getProviders().covidApi.getCurrentData();
    if (!result || !result.items.length)
    {
        res.json(null);
    }
    else {
        let age: number = (req.query.age) ? parseInt(req.query.age.toString()) : null;
        let free: boolean = (req.query.free && req.query.free.toString().toLowerCase() == 'true');
        let regions = result.items
            .filter(x => {
                return (!age || (
                    (!x.ageFrom || x.ageFrom <= age)
                    && (!x.ageTo || x.ageTo >= age)
                )) && (
                    !free || x.freeCapacity > 0
                )
            })
            .map(x => {
                return {
                    region: x.region,
                    freeCapacity: x.freeCapacity
                }
            })
            .reduce((a, b) => {
                a[b.region] = (a[b.region] || 0) + b.freeCapacity;
                return a;
            }, {});

        res.json({
            'lastUpdate': result.lastUpdate,
            'regions': regions
        });
    }
}

export function getCities(req: Request, res: Response, next: NextFunction) {
    const result = getProviders().covidApi.getCurrentData();
    if (!result || !result.items.length)
    {
        res.json(null);
    }
    else {
        let age: number = (req.query.age) ? parseInt(req.query.age.toString()) : null;
        let region: string = (req.query.region) ? req.query.region.toString() : null;
        let free: boolean = (req.query.free && req.query.free.toString().toLowerCase() == 'true');
        let cities = result.items
            .filter(x => {
                return (!age || (
                    (!x.ageFrom || x.ageFrom <= age)
                    && (!x.ageTo || x.ageTo >= age)
                )) && (
                    !region || x.region.toLocaleLowerCase() == region.toLocaleLowerCase()
                ) && (
                    !free || x.freeCapacity > 0
                )
            })
            .map(x => {
                return {
                    city: x.city,
                    freeCapacity: x.freeCapacity
                }
            })
            .reduce((a, b) => {
                a[b.city] = (a[b.city] || 0) + b.freeCapacity;
                return a;
            }, {});

        res.json({
            'lastUpdate': result.lastUpdate,
            'regions': cities
        });
    }
}

export function getPlaces(req: Request, res: Response, next: NextFunction) {
    const result = getProviders().covidApi.getCurrentData();
    if (!result || !result.items.length)
    {
        res.json(null);
    }
    else {
        let age: number = (req.query.age) ? parseInt(req.query.age.toString()) : null;
        let region: string = (req.query.region) ? req.query.region.toString() : null;
        let city: string = (req.query.city) ? req.query.city.toString() : null;
        let free: boolean = (req.query.free && req.query.free.toString().toLowerCase() == 'true');
        let places = result.items
            .filter(x => {
                return (!age || (
                    (!x.ageFrom || x.ageFrom <= age)
                    && (!x.ageTo || x.ageTo >= age)
                )) && (
                    !region || x.region.toLocaleLowerCase() == region.toLocaleLowerCase()
                ) && (
                    !city || x.city.toLocaleLowerCase() == city.toLocaleLowerCase()
                ) && (
                    !free || x.freeCapacity > 0
                )
            });

        res.json({
            'lastUpdate': result.lastUpdate,
            'places': places
        });
    }
}

export function getApiData(req: Request, res: Response, next: NextFunction) {
    const result = getProviders().covidApi.getCurrentApiData();
    res.json(result);
}