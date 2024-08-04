#!/usr/bin/node
const { MongoClient } = require('mongodb');

/**
 * ! DBClient class to interact with MongoDB !
 *
 * This class provides methods to connect to a MongoDB database and interact with it.
 * It uses the MongoDB Node.js driver to connect to the database and perform operations.
 *
 * Configuration parameters such as database host, port, and name can be customized
 * via environment variables.
 *
 * The class includes methods to check if the database connection is alive and
 * to get counts of documents in specific collections.
 */
class DBClient {
  constructor() {
    this.dbClient = null; // Holds the database client instance
    this.connect(); // Initiates the connection to the database
  }

  /**
   * Establishes a connection to the MongoDB database.
   *
   * Retrieves database connection details from environment variables or uses
   * default values if not provided. Connects to MongoDB and selects the appropriate
   * database. Logs a message indicating success or failure.
   *
   * @async
   * @returns {Promise<void>} Resolves when the connection attempt completes.
   */
  async connect() {
    const DB_HOST = process.env.DB_HOST || 'localhost'; // Database host, default: 'localhost'
    const DB_PORT = process.env.DB_PORT || 27017; // Database port, default: 27017
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager'; // Database name, default: 'files_manager'
    const uri = `mongodb://${DB_HOST}:${DB_PORT}`; // Connection URI

    try {
      // Connect to MongoDB
      const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      this.dbClient = client.db(DB_DATABASE); // Select the specified database
      console.log('Connected to MongoDB'); // Log successful connection
    } catch (err) {
      // Handle connection error
      console.error('Failed to connect to MongoDB:', err);
      this.dbClient = null; // Set dbClient to null on error
    }
  }

  /**
   * Checks if the database connection is currently active.
   *
   * @returns {boolean} `true` if the connection is established, `false` otherwise.
   */
  isAlive() {
    return !!this.dbClient;
  }

  /**
   * Gets the count of documents in the 'users' collection.
   *
   * Assumes that the database connection is active. Returns the count of documents
   * in the 'users' collection.
   *
   * @async
   * @returns {Promise<number>} The count of documents in the 'users' collection.
   */
  async nbUsers() {
    return this.dbClient.collection('users').countDocuments();
  }

  /**
   * Gets the count of documents in the 'files' collection.
   *
   * Assumes that the database connection is active. Returns the count of documents
   * in the 'files' collection.
   *
   * @async
   * @returns {Promise<number>} The count of documents in the 'files' collection.
   */
  async nbFiles() {
    return this.dbClient.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
