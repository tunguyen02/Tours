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
    .get(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

tourRouter.route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);

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
        authMiddleware.restrictTo('admin', 'lead-guide'),
        tourController.updateTour)
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );


export default tourRouter;
