#!/usr/bin/node
const redis = require('redis');

/**
 * RedisClient class for interacting with a Redis database.
 * Provides methods to set, get, and delete keys, and check connection status.
 */
class RedisClient {
  /**
   * Creates an instance of RedisClient.
   * Initializes the Redis client and sets up event listeners for connection status.
   */
  constructor() {
    this.client = redis.createClient();

    // Handling connection errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.connected = false;
    });

    // Handling successful connection
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.connected = true;
    });

    // Handling the end of the connection
    this.client.on('end', () => {
      console.log('Disconnected from Redis');
      this.connected = false;
    });

    // Initialize connection status
    this.connected = false;
  }

  /**
   * Checks if the Redis client is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} A promise that resolves with the value associated with the key,
   * or null if the key does not exist.
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Sets a value for the specified key in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {string} value - The value to store.
   * @param {number} durationInSec - The expiration time in seconds.
   * @returns {Promise<string>} A promise that resolves with the result of the set operation,
   * typically 'OK' if successful.
   */
  async set(key, value, durationInSec) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', durationInSec, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Deletes the specified key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<number>} A promise that resolves with the number of keys removed (0 or 1).
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Closes the Redis connection.
   */
  quit() {
    this.client.quit();
  }
}

const redisClient = new RedisClient();
export default redisClient;
