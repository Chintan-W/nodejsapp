const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars').create();
const app = express();
const database = require('./config/database2');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;

// Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect(database.url);

const Car = require('./models/car.js');
//helper to print everythird row
exphbs.handlebars.registerHelper('everyThird', function (index, options) {
    if (index % 3 === 2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});
// Get all car data from the database
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Set up a route to render all car data using Handlebars
app.get('/api/cars/view', async (req, res) => {
    try {
      const cars = await Car.find();
      res.render('cars', { cars }); // Render the 'cars' view with the retrieved data
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// search query
app.get('/api/cars/search', async (req, res) => {
    try {
      const searchQuery = req.query.searchQuery;
  
      // Use a regular expression to perform a case-insensitive search
      const cars = await Car.find({ InvoiceNo: { $regex: new RegExp(searchQuery, 'i') } });
  
      res.render('cars', { cars }); // Render the 'cars' view with the retrieved data
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// Get a car with ID
app.get('/api/cars/:car_id', async (req, res) => {
  try {
    const id = req.params.car_id;
    const car = await Car.findById(id);
    res.json(car);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Insert a new car
app.post('/api/cars', async (req, res) => {
  try {
    console.log(req.body);
    const car = await Car.create({
      InvoiceNo: req.body.InvoiceNo,
      image: req.body.image,
      Manufacturer: req.body.Manufacturer,
      class: req.body.class,
      Sales_in_thousands: req.body.Sales_in_thousands,
      // Add other fields accordingly
    });

    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update "Manufacturer" & “price_in_thousands” of an existing car
app.put('/api/cars/:car_id', async (req, res) => {
  try {
    const id = req.params.car_id;
    const data = {
      Manufacturer: req.body.Manufacturer,
      Price_in_thousands: req.body.Price_in_thousands,
      // Add other fields accordingly
    };

    await Car.findByIdAndUpdate(id, data);
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a car by ID
app.delete('/api/cars/:car_id', async (req, res) => {
  try {
    const id = req.params.car_id;
    const result = await Car.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send('Car not found');
    }

    res.send('Successfully! Car has been Deleted.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log("App listening on port: " + port);
});
