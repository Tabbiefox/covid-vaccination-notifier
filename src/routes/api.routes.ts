import { Router } from 'express';
import * as ApiController from '../controllers/api.controller';

/**
 * Registration of API routes
 */
const ApiRouter = Router();
ApiRouter.get('/covidApiDemo', async (req, res, next) => await ApiController.getCovidApiDemo(req, res, next));
ApiRouter.get('/apiData', async (req, res, next) => await ApiController.getApiData(req, res, next));
ApiRouter.get('/regions', async (req, res, next) => await ApiController.getRegions(req, res, next));
ApiRouter.get('/cities', async (req, res, next) => await ApiController.getCities(req, res, next));
ApiRouter.get('/places', async (req, res, next) => await ApiController.getPlaces(req, res, next));

export default ApiRouter;