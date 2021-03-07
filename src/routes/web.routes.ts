import { Router } from 'express';
import * as HomeController from '../controllers/home.controller';

/**
 * Registration of API routes
 */
const WebRouter = Router();
WebRouter.get('/', async (req, res, next) => await HomeController.index(req, res, next));

export default WebRouter;