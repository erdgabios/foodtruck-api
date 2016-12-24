import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import bodyParser from 'body-parser';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // CRUD - Create Read Update Delete
  // '/v1/foodtruck/add' - CREATE
  api.post('/add', authenticate, (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;


    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved successfully' });
    });
  });

  // '/v1/foodtruck' - READ
  api.get('/', authenticate, (req,res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // '/v1/foodtruck/:id' - Read 1
  api.get('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
    }
    res.json(foodtruck);
    });
  });

  // '/v1/foodtruck/foodtype/:foodtype' - Read 2
  api.get('/foodtype/:foodtype', authenticate, (req, res) => {
    FoodTruck.find({ foodtype: req.params.foodtype }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // '/v1/foodtruch/name/:name' - Read 3
  api.get('/name/:name', authenticate, (req, res) => {
    FoodTruck.find({ name: req.params.name }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // // '/v1/foodtruck/avgcost/:avgcostgt/:avgcostlt' - Read 4
  // api.get('/avgcost/:avgcostgt/:avgcostlt', (req, res) => {
  //   FoodTruck.find({ avgcost: { $gt: avgcostgt, $lt: avgcostlt } }, (err, foodtruck) => {
  //     if (err) {
  //       res.send(err);
  //     }
  //     res.json(foodtruck);
  //   });
  // });

  // '/v1/foodtruck/:id' - Update name
  api.put('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: "FoodTruck info - name updated" });
      });
    });
  });

  // '/v1/foodtruck/:id' - Delete
  api.delete('/:id', authenticate, (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "FoodTruck Successfully Removed" });
    });
  });

  // add review for a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', authenticate,  (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id
      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved!' });
        });
      });
    });
  });

  // reviews for a specific food truck id
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', authenticate, (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews)
    })
  })

  return api;
}
