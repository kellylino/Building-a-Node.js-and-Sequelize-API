const router = require('express').Router();
const Phone = require('../models/phone');
const Joi = require('joi');

const schema = Joi.object({
  number: Joi.string().required(),
  UserId: Joi.number().required()
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
    const phone = await Phone.findByPk(req.params.id);
    if (!phone) {
      return res.status(404).json({ error: 'Phone not found' });
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
    const phone = await Phone.findAll({});
    return res.json(phone);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try {
    const phone = await Phone.findByPk(req.params.id);

    return res.json(phone);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search/number', async (req, res) => {
  try {
    const { number } = req.query;

    if (!number) return res.status(400).json({ message: 'Phone number not provided' });

    const phone = await Phone.findAll({
      where: {
        number: number
      }
    });

    if (phone.length === 0) return res.status(404).json({ message: 'not found' });
    return res.status(200).json(phone);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body.number);

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const { UserId, number, comment } = req.body;

    const newPhone = await Phone.create({
      number,
      comment,
      UserId
    });

    return res.status(201).json(newPhone);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(403).json({ message: 'number must be unique' })
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(403).json({ message: 'UsereId FOREIGN KEY constraint failed' })
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try { 
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    const { number, comment, UserId } = req.body;

    //if(number ) return res.status(400).json({ mesage: 'number cannot be empty' });

    await Phone.update({
      number: number,
      comment: comment,
      UserId: UserId
    }, {
      where: {
        id: req.params.id
      }
    });

    const updatedPhone = await Phone.findByPk(req.params.id);

    return res.status(200).json(updatedPhone);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(403).json({ message: 'number must be unique' })
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(403).json({ message: 'UserId FOREIGN KEY constraint failed' })
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', [checkIDInput, checkIDExist], async (req, res) => {
  try {
    await Phone.destroy({
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