import { Router } from "express";
import tourController from "../controller/tourController.js";

const tourRouter = Router();

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
