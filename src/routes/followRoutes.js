import express from 'express';
import { FollowPresenter } from '../presenters/FollowPresenter.js';
import { AuthPresenter } from '../presenters/AuthPresenter.js';

const router = express.Router();

router.post('/:userId', AuthPresenter.verifyToken, FollowPresenter.followUser);
router.delete('/:userId', AuthPresenter.verifyToken, FollowPresenter.unfollowUser);
router.get('/:userId/followers', FollowPresenter.getFollowers);
router.get('/:userId/following', FollowPresenter.getFollowing);
router.get('/:userId/status', AuthPresenter.verifyToken, FollowPresenter.checkFollowStatus);

export default router;