'use strict';
// userController
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

const users = userModel.users;

const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

const user_get_by_id = async (req, res) => {
  console.log('userController: http get user with path param', req.params);
  const user = await userModel.getUser(req.params.id);
  res.json(user);
}

const user_create = async (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //here we will create a user with data comming from req...
  console.log('userController user_create', req.body);
  //hasing password before insert into database
  const user = {};
  user.name = req.body.name;
  user.username = req.body.username;
  const salt = bcrypt.genSaltSync(12);
  user.password = bcrypt.hashSync(req.body.password, salt);
  console.log('userController user_create after hashing?', req.body, user);

  const id = await userModel.insertUser(user);
  if (id > 0) {
    next();
  } else {
    res.status(400).json({error: 'register error'}).end();
  }
}

const user_update = async (req, res) => {
  const updateOk = await userModel.updateUser(req.params.id, req);
  res.send(`updated... ${updateOk}`);
};

const user_delete = async (req, res) => {
  res.send('deleted...');
};

module.exports = {
  user_list_get,
  user_get_by_id,
  user_create,
  user_update,
  user_delete
};
