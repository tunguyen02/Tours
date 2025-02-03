import { Router } from "express";
import reviewController from "../controller/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.use(authMiddleware.protect);

reviewRouter.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authMiddleware.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

reviewRouter.route('/:id')
    .get(reviewController.getReview)
    .delete(authMiddleware.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authMiddleware.restrictTo('user', 'admin'), reviewController.updateReview);

export default reviewRouter;