// routes/netRevenue.routes.js
import express from 'express';
import { getNetRevenue } from '../controllers/netRevenue.controller.js';
import { protectAdmin } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get('/', protectAdmin, getNetRevenue);

export default router;
