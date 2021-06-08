import express from 'express';
import { syncContracts, syncDeliverables } from '../controllers/sync.controller';

const router = express.Router();

router.post('/contracts', syncContracts);

router.post('/deliverables', syncDeliverables);

export default router;