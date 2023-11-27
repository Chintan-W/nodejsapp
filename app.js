const express = require('express');
const mongoose = require('mongoose');
const app = express();
const database = require('./config/database');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect(database.url);

const Employee = require('./models/employee');

// Get all employee data from the database
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get an employee with ID
app.get('/api/employees/:employee_id', async (req, res) => {
  try {
    const id = req.params.employee_id;
    const employee = await Employee.findById(id);
    res.json(employee);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/employees', async (req, res) => {
	try {
	  console.log(req.body); // Log the request body to see what data is being received
  
	  const employee = await Employee.create({
		name: req.body.name,
		salary: req.body.salary,
		age: req.body.age
	  });
  
	  const employees = await Employee.find();
	  res.json(employees);
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });
  

// Update an employee and send back all employees after update
app.put('/api/employees/:employee_id', async (req, res) => {
  try {
    const id = req.params.employee_id;
    const data = {
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age
    };

    await Employee.findByIdAndUpdate(id, data);
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete an employee by ID
app.delete('/api/employees/:employee_id', async (req, res) => {
	try {
	  const id = req.params.employee_id;
	  const result = await Employee.findByIdAndDelete(id);
  
	  if (!result) {
		return res.status(404).send('Employee not found');
	  }
  
	  res.send('Successfully! Employee has been Deleted.');
	} catch (err) {
	  res.status(500).send(err.message);
	}
  });
  

app.listen(port, () => {
  console.log("App listening on port: " + port);
});
