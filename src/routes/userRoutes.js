import express from 'express';
import { UserPresenter } from '../presenters/UserPresenter.js';
import { AuthPresenter } from '../presenters/AuthPresenter.js';

const router = express.Router();

router.get('/profile/:userId', UserPresenter.getProfile);
router.put('/profile', AuthPresenter.verifyToken, UserPresenter.updateProfile);
router.get('/search', AuthPresenter.verifyToken, UserPresenter.searchUsers);

export default router;