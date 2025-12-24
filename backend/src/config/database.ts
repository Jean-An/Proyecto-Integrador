import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Set to console.log to see SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connected successfully.');
    // Sync models
    await sequelize.sync({ alter: true }); // alter: true updates tables if models change
    console.log('Models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
