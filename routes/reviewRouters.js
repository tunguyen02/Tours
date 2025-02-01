import { Router } from "express";
import reviewController from "../controller/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authMiddleware.protect,
        authMiddleware.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

reviewRouter.route('/:id')
    .get(reviewController.getReview)
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        reviewController.deleteReview
    )
    .patch(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        reviewController.updateReview
    );

export default reviewRouter;