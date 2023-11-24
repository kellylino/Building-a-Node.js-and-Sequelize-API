const database = require('./config/database')
const express = require('express');
const app = express();
const port = 5050;
const userRouter = require('./routes/userRoutes');
const phoneRouter = require('./routes/phoneRoutes');
const Phone = require('./models/phone');
const User = require('./models/user');

// Enable JSON parsing for incoming requests
app.use(express.json());

app.use('/user', userRouter);
app.use('/phone', phoneRouter);

//error handler 
app.use((err, req, res, next) => {
  res.status(400).send({ error: 'Something failed!' })
  next(err);
});

app.get('/', function (req, res) {
  console.log('app listening on port: ' + port);
  res.send('test express nodejs sqlite')
});

// Authenticate and establish a connection to the database
database.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    database.sync(); // Wait for the database sync before starting the app
    // Define a relationship between Phone and User models
    User.hasMany(Phone);
    Phone.belongsTo(User);
  })
  .then(() => {
    // Start the application after successful database connection
    app.listen(port, function () {
      console.log('app listening on port: ' + port);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;