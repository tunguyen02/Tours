import { Router } from "express";
import tourController from "../controller/tourController.js";

const tourRouter = Router();

tourRouter
    .route('/tour-stats')
    .get(tourController.getTourStats);

tourRouter
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

export default tourRouter;
