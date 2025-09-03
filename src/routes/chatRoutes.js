import express from 'express';
import { ChatPresenter } from '../presenters/ChatPresenter.js';
import { AuthPresenter } from '../presenters/AuthPresenter.js';

const router = express.Router();

router.post('/message', AuthPresenter.verifyToken, ChatPresenter.sendMessage);
router.get('/conversation/:userId', AuthPresenter.verifyToken, ChatPresenter.getConversation);
router.get('/conversations', AuthPresenter.verifyToken, ChatPresenter.getUserConversations);

export default router;