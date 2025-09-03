import express from 'express';
import { PostPresenter } from '../presenters/PostPresenter.js';
import { AuthPresenter } from '../presenters/AuthPresenter.js';

const router = express.Router();

router.post('/', AuthPresenter.verifyToken, PostPresenter.createPost);
router.get('/feed', AuthPresenter.verifyToken, PostPresenter.getFeedPosts);
router.post('/:postId/like', AuthPresenter.verifyToken, PostPresenter.likePost);
router.post('/:postId/comment', AuthPresenter.verifyToken, PostPresenter.addComment);

export default router;