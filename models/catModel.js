'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute('SELECT cat_id, wop_cat.name, age, weight, owner, filename, user_id, coords, wop_user.name AS ownername FROM wop_cat LEFT JOIN wop_user ON owner = user_id');
    return rows;
  } catch (e) {
    console.error('catModel:', e.message);
  }
};

const getCat = async (id) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    console.log('catModel getCat', id);
    const [rows] = await promisePool.execute('SELECT * FROM wop_cat WHERE cat_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('catModel:', e.message);
  }
};

const insertCat = async (req) => {
  try {
    const [rows] = await promisePool.execute('INSERT INTO wop_cat (name, age, weight, owner, filename, coords) VALUES (?, ?, ?, ?, ?, ?);',
      [req.body.name, req.body.age, req.body.weight, req.body.owner, req.file.filename, req.body.coords]);
    console.log('catModel insert:', rows);
    return rows.insertId;
  } catch (e) {
    console.error('insertCat:', e.message);
    throw new Error('insertCat failed');
  }
};

const updateCat = async (id, req) => {
  try {
    const [rows] = await promisePool.execute('UPDATE wop_cat SET name = ?, age = ?, weight = ? WHERE cat_id = ?;',
    [req.body.name, req.body.age, req.body.weight, id]);
    console.log('catModel update:', rows);
    return rows.affectedRows === 1;
  } catch (e) {
    return false;
  }
};

//TODO: delete function. Consider no return needed? just best effort...
const deleteCat = async (id) => {
  try {
    console.log('catModel deleteCat', id);
    const [rows] = await promisePool.execute('DELETE FROM wop_cat WHERE cat_id = ?', [id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('catModel:', e.message);
  }
};

module.exports = {
  getAllCats,
  getCat,
  insertCat,
  updateCat,
  deleteCat,
};
