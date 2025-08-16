const express = require('express');
const db = require('../database');           // добавьте ../
const { authenticateToken } = require('../auth'); // добавьте ../

const router = express.Router();

// Модерація мітки (тільки для адмінів)
router.put('/:id/moderate', authenticateToken, (req, res) => {
  const markerId = req.params.id;
  const { is_moderated } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ заборонений. Тільки адміни можуть модерувати мітки.' });
  }

  console.log(`PUT /markers/${markerId}/moderate запит від адміна:`, req.user.email);
  console.log('Новий статус модерації:', is_moderated);

  db.run('UPDATE markers SET is_moderated = ? WHERE id = ?', [is_moderated, markerId], function(err) {
    if (err) {
      console.error('Помилка оновлення статусу модерації:', err);
      return res.status(500).json({ error: 'Помилка оновлення статусу модерації' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Мітка не знайдена' });
    }

    db.get('SELECT * FROM markers WHERE id = ?', [markerId], (err, updatedRow) => {
      if (err) {
        console.error('Помилка отримання оновленої мітки:', err);
        return res.status(500).json({ error: 'Помилка отримання оновленої мітки' });
      }

      console.log('Статус модерації оновлено, ID:', markerId, 'Модерована:', is_moderated);
      res.json({ 
        message: is_moderated ? 'Мітка схвалена' : 'Модерація мітки скасована',
        marker: updatedRow
      });
    });
  });
});

// Получение немодерированных меток (только для админов)
router.get('/unmoderated', authenticateToken, (req, res) => {
  console.log('GET /markers/unmoderated запит від:', req.user.email);
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ заборонений. Тільки адміни можуть переглядати немодеровані мітки.' });
  }
  
  db.all('SELECT * FROM markers WHERE is_moderated = 0 ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Помилка отримання немодерованих міток:', err);
      return res.status(500).json({ error: 'Помилка бази даних' });
    }
    
    console.log(`Знайдено ${rows.length} немодерованих міток`);
    res.json({ markers: rows });
  });
});

// Получение статистики модерации (только для админов)
router.get('/moderation-stats', authenticateToken, (req, res) => {
  console.log('GET /markers/moderation-stats запит від:', req.user.email);
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ заборонений. Тільки адміни можуть переглядати статистику модерації.' });
  }
  
  db.get('SELECT COUNT(*) as total FROM markers', [], (err, totalResult) => {
    if (err) {
      console.error('Помилка отримання загальної кількості міток:', err);
      return res.status(500).json({ error: 'Помилка бази даних' });
    }
    
    db.get('SELECT COUNT(*) as moderated FROM markers WHERE is_moderated = 1', [], (err, moderatedResult) => {
      if (err) {
        console.error('Помилка отримання кількості модерованих міток:', err);
        return res.status(500).json({ error: 'Помилка бази даних' });
      }
      
      db.get('SELECT COUNT(*) as unmoderated FROM markers WHERE is_moderated = 0', [], (err, unmoderatedResult) => {
        if (err) {
          console.error('Помилка отримання кількості немодерованих міток:', err);
          return res.status(500).json({ error: 'Помилка бази даних' });
        }
        
        const stats = {
          total: totalResult.total,
          moderated: moderatedResult.moderated,
          unmoderated: unmoderatedResult.unmoderated,
          moderationPercentage: totalResult.total > 0 ? 
            Math.round((moderatedResult.moderated / totalResult.total) * 100) : 0
        };
        
        console.log('Статистика модерації:', stats);
        res.json(stats);
      });
    });
  });
});

module.exports = router;