#!/usr/bin/node
import { ObjectId } from 'mongodb';
import fs from 'fs';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function getUserByToken(req, res) {
  const token = req.header('X-Token');

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const ObjId = new ObjectId(userId);
  const user = await dbClient.dbClient.collection('users').findOne({ _id: ObjId });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return { id: userId, email: user.email };
}

class FilesController {
  static async postUpload(req, res) {
    const user = await getUserByToken(req, res);
    const {
      name, type, data, isPublic,
    } = req.body;

    let parentId = req.body.parentId || '0';
    const types = ['folder', 'file', 'image'];

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !types.includes(type)) return res.status(400).json({ error: 'Missing type' });

    if (type !== types[0] && !data) return res.status(400).json({ error: 'Missing data' });

    if (parentId !== '0') {
      console.log(parentId);
      const file = await dbClient.dbClient.collection('files').findOne({ _id: ObjectId(parentId) });
      if (!file) return res.status(400).json({ error: 'Parent not found' });
      if (file.type !== types[0]) return res.status(400).json({ error: 'Parent is not a folder' });
    }
    parentId = parentId !== '0' ? ObjectId(parentId) : '0';

    const folderInfo = {
      userId: ObjectId(user.id),
      name,
      type,
      isPublic: isPublic || false,
      parentId,
    };

    if (type === types[0]) {
      const newFile = await dbClient.dbClient.collection('files').insertOne(folderInfo);
      return res.status(201).json({ id: newFile.insertedId, ...folderInfo });
    }

    const folderName = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileId = uuidv4();
    const localPath = path.join(folderName, fileId);

    await fs.promises.mkdir(folderName, { recursive: true });
    await fs.promises.writeFile(localPath, Buffer.from(data, 'base64'));

    const newFile = await dbClient.dbClient.collection('files').insertOne({ localPath, ...folderInfo });

    return res.status(201).json({ id: newFile.insertedId, localPath, ...folderInfo });
  }
}

export default FilesController;
