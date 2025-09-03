import express from 'express';
import { AuthPresenter } from '../presenters/AuthPresenter.js';

const router = express.Router();

router.post('/register', AuthPresenter.register);
router.post('/login', AuthPresenter.login);

export default router;