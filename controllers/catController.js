'use strict';
// catController
const catModel = require('../models/catModel');
const {validationResult} = require('express-validator');
const {makeThumbnail} = require('../utils/resize');
const {getCoordinates} = require('../utils/imageMeta');

const cats = catModel.cats;

const cat_list_get = async (req, res) => {
  const cats = await catModel.getAllCats();
  res.json(cats);
};

const cat_get_by_id = async (req, res) => {
  console.log('catController: http get cat with path param', req.params);
  const cat = await catModel.getCat(req.params.id);
  res.json(cat);
};

const cat_create = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {
    // hae koordinaatit
    const coords = await getCoordinates(req.file.path);
    // console.log('coords', coords);
    req.body.coords = coords;
    //here we will create a cat with data comming from req...
    console.log('catController cat_create', req.body, req.file);
    const id = await catModel.insertCat(req);
    const cat = await catModel.getCat(id);
    res.send(cat);
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const cat_update = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const updateOk = await catModel.updateCat(req.params.id, req);
  res.send(`updated... ${updateOk}`);
};

const cat_delete = async (req, res) => {
  const deleteOk = await catModel.deleteCat(req.params.id);
  res.json(deleteOk);
};

const make_thumbnail = async (req, res, next) => {
  try {
    const thumbnail = await makeThumbnail(req.file.path, req.file.filename);
    if (thumbnail) {
      next();
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

module.exports = {
  cat_list_get,
  cat_get_by_id,
  cat_create,
  cat_update,
  cat_delete,
  make_thumbnail,
};
