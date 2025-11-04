import express from 'express';
import { MatrimonialController } from '../controllers/matrimonialController';

const router = express.Router();

router.get('/profiles', MatrimonialController.getProfiles);
router.post('/profiles', MatrimonialController.createProfile);
router.patch('/profiles/:id/interest', MatrimonialController.toggleInterest);
router.patch('/profiles/:id/match', MatrimonialController.setMatch);
router.patch('/profiles/:id/block', MatrimonialController.blockProfile);

router.get('/messages/:profileId', MatrimonialController.getMessages);
router.post('/messages', MatrimonialController.sendMessage);

export default router;