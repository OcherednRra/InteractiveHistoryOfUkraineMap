const express = require('express');
const db = require('../database');           // добавьте ../
const { authenticateToken } = require('../auth'); // добавьте ../
const { AVAILABLE_ICONS } = require('../constants'); // добавьте ../

const router = express.Router();

// Отримання всіх міток
router.get('/', (req, res) => {
  console.log('GET /markers запит');
  
  db.all('SELECT * FROM markers ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Помилка отримання міток:', err);
      return res.status(500).json({ error: 'Помилка бази даних' });
    }
    
    console.log(`Знайдено ${rows.length} міток`);
    res.json({ markers: rows });
  });
});

// Додавання нової мітки
router.post('/', authenticateToken, (req, res) => {
  console.log('POST /markers запит:', req.body);
  console.log('Користувач:', req.user);

  try {
    const { latitude, longitude, title, description, icon, event_date, tags } = req.body;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    // Валідація координат
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Координати обов'язкові" });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Координати повинні бути числами' });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Широта повинна бути між -90 та 90' });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Довгота повинна бути між -180 та 180' });
    }

    // Валідація заголовка
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: "Назва не може бути порожньою" });
    }

    if (title.length > 100) {
      return res.status(400).json({ error: 'Назва не може містити більше 100 символів' });
    }

    // Валідація опису
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: "Опис не може бути порожнім" });
    }

    if (description.length > 3000) {
      return res.status(400).json({ error: 'Опис не може містити більше 3000 символів' });
    }

    // Валідація іконки
    const finalIcon = icon && AVAILABLE_ICONS.includes(icon) ? icon : 'MapPin';

    // Визначаємо статус модерації: адміни створюють одразу модеровані мітки
    const isModerated = userRole === 'admin';

    // Збереження мітки
    db.run(
      'INSERT INTO markers (latitude, longitude, title, description, icon, user_email, event_date, tags, is_moderated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [latitude, longitude, title.trim(), description.trim(), finalIcon, userEmail, event_date, tags, isModerated],
      function (err) {
        if (err) {
          console.error('Помилка збереження мітки:', err);
          return res.status(500).json({ error: 'Помилка збереження мітки' });
        }

        console.log('Мітка збережена з ID:', this.lastID, 'Модерована:', isModerated);

        // Повернення створеної мітки
        db.get('SELECT * FROM markers WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            console.error('Помилка отримання створеної мітки:', err);
            return res.status(500).json({ error: 'Помилка отримання мітки' });
          }

          res.status(201).json({
            message: isModerated ? 'Мітка успішно додана' : 'Мітка додана та очікує на модерацію',
            marker: row,
          });
        });
      }
    );
  } catch (error) {
    console.error('Внутрішня помилка:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

// Оновлення мітки
router.put('/:id', authenticateToken, (req, res) => {
  const markerId = req.params.id;
  const userEmail = req.user.email;
  const { title, description, icon, event_date, tags } = req.body;
  
  const updateQuery = 'UPDATE markers SET title = ?, description = ?, icon = ?, event_date = ?, tags = ? WHERE id = ?';
	
  console.log(`PUT /markers/${markerId} запит від користувача:`, userEmail);
  console.log('Нові дані:', { title, description, icon });
  
  // Валідація заголовка
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Назва не може бути порожньою' });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ error: 'Назва не може містити більше 100 символів' });
  }
  
  // Валідація опису
  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Опис не може бути порожнім' });
  }
  
  if (description.length > 3000) {
    return res.status(400).json({ error: 'Опис не може містити більше 3000 символів' });
  }
  
  // Валідація іконки
  const finalIcon = icon && AVAILABLE_ICONS.includes(icon) ? icon : 'MapPin';
  
  // Якщо користувач - адмін, дозволяємо редагувати будь-яку мітку
  if (req.user.role === 'admin') {
    db.run(updateQuery, [title.trim(), description.trim(), finalIcon, event_date || null, tags || null, markerId], function(err) {
      if (err) {
        console.error('Помилка оновлення мітки:', err);
        return res.status(500).json({ error: 'Помилка оновлення мітки' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Мітка не знайдена' });
      }
      
      db.get('SELECT * FROM markers WHERE id = ?', [markerId], (err, updatedRow) => {
        if (err) {
          console.error('Помилка отримання оновленої мітки:', err);
          return res.status(500).json({ error: 'Помилка отримання оновленої мітки' });
        }
        
        console.log('Мітка оновлена, ID:', markerId);
        res.json({ 
          message: 'Мітка успішно оновлена',
          marker: updatedRow
        });
      });
    });
  } else {
    db.get('SELECT * FROM markers WHERE id = ? AND user_email = ?', [markerId, userEmail], (err, row) => {
      if (err) {
        console.error('Помилка перевірки мітки:', err);
        return res.status(500).json({ error: 'Помилка бази даних' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Мітка не знайдена або не належить користувачу' });
      }
      
      db.run(updateQuery, [title.trim(), description.trim(), finalIcon, event_date || null, tags || null, markerId], function(err) {
        if (err) {
          console.error('Помилка оновлення мітки:', err);
          return res.status(500).json({ error: 'Помилка оновлення мітки' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Мітка не знайдена' });
        }
        
        db.get('SELECT * FROM markers WHERE id = ?', [markerId], (err, updatedRow) => {
          if (err) {
            console.error('Помилка отримання оновленої мітки:', err);
            return res.status(500).json({ error: 'Помилка отримання оновленої мітки' });
          }
          
          console.log('Мітка оновлена, ID:', markerId);
          res.json({ 
            message: 'Мітка успішно оновлена',
            marker: updatedRow
          });
        });
      });
    });
  }
});

// Видалення мітки
router.delete('/:id', authenticateToken, (req, res) => {
  const markerId = req.params.id;
  const userEmail = req.user.email;

  console.log(`DELETE /markers/${markerId} запит від користувача:`, userEmail);

  if (req.user.role === 'admin') {
    db.run('DELETE FROM markers WHERE id = ?', [markerId], function (err) {
      if (err) {
        console.error('Помилка видалення мітки:', err);
        return res.status(500).json({ error: 'Помилка видалення мітки' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Мітка не знайдена' });
      }

      console.log('Мітка видалена адміном, ID:', markerId);
      res.json({ message: 'Мітка успішно видалена' });
    });
  } else {
    db.get('SELECT * FROM markers WHERE id = ? AND user_email = ?', [markerId, userEmail], (err, row) => {
      if (err) {
        console.error('Помилка перевірки мітки:', err);
        return res.status(500).json({ error: 'Помилка бази даних' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Мітка не знайдена або не належить користувачу' });
      }

      db.run('DELETE FROM markers WHERE id = ?', [markerId], function (err) {
        if (err) {
          console.error('Помилка видалення мітки:', err);
          return res.status(500).json({ error: 'Помилка видалення мітки' });
        }

        console.log('Мітка видалена, ID:', markerId);
        res.json({ message: 'Мітка успішно видалена' });
      });
    });
  }
});

module.exports = router;