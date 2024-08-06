import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  // eslint-disable-next-line no-unused-vars
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
