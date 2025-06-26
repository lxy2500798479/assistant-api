import { Hono } from 'hono';

import { RobotsController } from '../controller/robots.controller.ts';

import { checkToken } from '@/middlewares/token.ts';

const router = new Hono();
const robots = new RobotsController();

router.get('/getAllRobots', robots.getRobots);

router.post('/login', robots.loginRobot);
router.post('/logout', checkToken, robots.logoutRobot);

router.post('/register', robots.registerRobot);

export default router;
