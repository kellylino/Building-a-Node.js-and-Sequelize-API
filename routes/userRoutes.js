const router = require('express').Router();
const Phone = require('../models/phone');
const User = require('../models/user');
const Joi = require('joi');

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required()
});

// middleware
const checkIDInput = function (req, res, next) {
  if (isNaN(req.params.id)) {
    res.status(400).json({ error: 'Invalid ID supplied' });
  } else {
    next();
  }
}

const checkIDExist = async function (req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Phone, // Include the associated phones
        attributes: ['id', 'number', 'comment'], // Include only specific phone attributes
      }]
    });

    const modifiedUsers = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      city: user.city,
      address: user.address,
      phones: user.Phones.map(phone => ({ // Access the associated phones through Phones
        id: phone.id,
        number: phone.number,
        comment: phone.comment,
      })),
    }));

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Phone,
        attributes: ['id', 'number', 'comment'],
      }]
    });

    const modifiedUsers = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      city: user.city,
      address: user.address,
      phones: user.Phones.map(phone => ({
        id: phone.id,
        number: phone.number,
        comment: phone.comment,
      })),
    };

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search/name', async (req, res) => {
  try {
    const { first_name, last_name } = req.query;

    if (!first_name || !last_name) {
      return res.status(400).json({ message: 'Missing search criteria' });
    }

    const users = await User.findAll({
      include: [{
        model: Phone,
      }],
      where: {
        first_name: first_name,
        last_name: last_name
      }
    });

    if (users.length === 0) return res.status(404).json({ message: 'not found' });

    const modifiedUsers = users.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      city: user.city,
      address: user.address,
      phones: user.Phones.map(phone => ({
        id: phone.id,
        number: phone.number,
        comment: phone.comment,
      })),
    }));

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search/nameAndNumber', async (req, res) => {
  try {
    const { first_name, last_name, number } = req.query;

    if (!first_name || !last_name || !number) {
      return res.status(400).json({ message: 'Missing search criteria' });
    }

    const users = await User.findAll({
      include: [{
        model: Phone,
        where: {
          number: number
        },
        attributes: ['id', 'number', 'comment'],
      }],
      where: {
        first_name: first_name,
        last_name: last_name
      }
    });

    if (users.length === 0) return res.status(404).json({ message: 'not found' });

    //uses Promise.all to wait for all user modifications before sending the response.
    const modifiedUsers = await Promise.all(users.map(async (user) => {
      const modifiedUser = await User.findByPk(user.id, {
        include: [{
          model: Phone,
          attributes: ['id', 'number', 'comment'],
        }]
      });

      return {
        id: modifiedUser.id,
        first_name: modifiedUser.first_name,
        last_name: modifiedUser.last_name,
        city: modifiedUser.city,
        address: modifiedUser.address,
        phones: modifiedUser.Phones.map(phone => ({
          id: phone.id,
          number: phone.number,
          comment: phone.comment,
        })),
      };
    }));

    res.status(200).json(modifiedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { first_name, last_name, city, address } = req.body;

    const newUser = await User.create({
      first_name,
      last_name,
      city,
      address,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try {
    const { first_name, last_name, city, address } = req.body;

    await User.update({
      first_name,
      last_name,
      city,
      address,
    }, {
      where: {
        id: req.params.id
      }
    });

    const updatedUser = await User.findByPk(req.params.id);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router