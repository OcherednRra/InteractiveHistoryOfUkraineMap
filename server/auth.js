const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');
const { JWT_SECRET } = require('./constants');

const router = express.Router();

// Middleware для перевірки автентифікації
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен доступу відсутній' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недійсний токен' });
    }
    req.user = user;
    next();
  });
};

// Реєстрація користувача
router.post('/register', async (req, res) => {
  console.log('POST /register запит:', req.body);
  try {
    const { email, password } = req.body;
    
    // Валідація даних
    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль повинен містити мінімум 6 символів' });
    }
    
    // Перевірка на існування користувача
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Помилка бази даних' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує' });
      }
      
      // Хешування пароля
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Збереження користувача
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', 
        [email, hashedPassword], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Помилка створення користувача' });
          }
          
          res.status(201).json({ 
            message: 'Користувач успішно зареєстрований',
            userId: this.lastID 
          });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

// Вхід користувача
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Помилка бази даних' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Неправильний email або пароль' });
      }
      
      // Перевірка пароля
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Неправильний email або пароль' });
      }
      
      // Створення JWT токена
      const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      
      res.json({
        message: 'Вхід успішний',
        token: token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

module.exports = { router, authenticateToken };