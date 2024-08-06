#!/usr/bin/node
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

function hashPassword(password) {
  return sha1(password);
}

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const emailFound = await dbClient.dbClient.collection('users').findOne({ email });
    if (emailFound) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashPwd = hashPassword(password);
    const result = await dbClient.dbClient.collection('users').insertOne({ email, password: hashPwd });
    return res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');

    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const ObjId = new ObjectId(userId);
    const user = await dbClient.dbClient.collection('users').findOne({ _id: ObjId });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ id: userId, email: user.email });
  }
}

export default UsersController;
