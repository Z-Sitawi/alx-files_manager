#!/usr/bin/node
import sha1 from 'sha1';
import dbClient from '../utils/db';

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
}

export default UsersController;
