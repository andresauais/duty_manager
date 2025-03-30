import { Router } from 'express';
import { dutyController } from '../controllers/duty.controller';

const router = Router();

router.get('/todos', dutyController.getAll);
router.post('/todos', dutyController.create);
router.put('/todos/:id', dutyController.update);
router.delete('/todos/:id', dutyController.remove);

export default router;
