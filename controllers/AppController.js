#!/usr/bin/node
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(req, res) {
    const nbrUsers = await dbClient.nbUsers();
    const nbrFiles = await dbClient.nbFiles();
    res.status(200).json({ users: nbrUsers, files: nbrFiles });
  }
}

export default AppController;
