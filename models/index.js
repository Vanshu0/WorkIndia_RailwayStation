

const { Sequelize, DataTypes } = require('sequelize');
console.log('DB_URL:', process.env.DB_URL); // TEMP DEBUG
// Initialize Sequelize with connection URL and dialect option
const sequelize = new Sequelize({
  database: 'world',
  username: 'root',
  password: 'Aryan@#123', // Raw password (no encoding needed here)
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
sequelize.sync({ force: true }) // Drops existing tables and recreates them
  .then(() => console.log(' All tables created!'))
  .catch(err => console.error(' Table creation failed:', err));
// Test the DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error(' Database connection failed:', err));

// Define User model
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING
});

// Define Train model
const Train = sequelize.define('Train', {
  name: DataTypes.STRING,
  source: DataTypes.STRING,
  destination: DataTypes.STRING
});

// Define SeatAvailability model
const SeatAvailability = sequelize.define('SeatAvailability', {
  availableSeats: DataTypes.INTEGER
});

// Define Booking model
const Booking = sequelize.define('Booking', {
    status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  }
},{ timestamps: true });

// Set up associations
User.hasMany(Booking);
Booking.belongsTo(User);

Train.hasMany(Booking);
Booking.belongsTo(Train);

Train.hasOne(SeatAvailability);
SeatAvailability.belongsTo(Train);

module.exports = {
  sequelize,
  User,
  Train,
  SeatAvailability,
  Booking
};
