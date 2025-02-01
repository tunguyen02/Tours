import { Router } from "express";
import tourController from "../controller/tourController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import reviewRouter from "../routes/reviewRouters.js";

const tourRouter = Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
    .route('/tour-stats')
    .get(tourController.getTourStats);

tourRouter
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin', 'lead-guide'),
        tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        tourController.updateTour)
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        tourController.deleteTour
    );


export default tourRouter;
