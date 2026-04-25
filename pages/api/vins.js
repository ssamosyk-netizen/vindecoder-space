import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Приймаємо параметр make (наприклад: ?make=dodge)
      const { make } = req.query;
      
      // Якщо передали марку, шукаємо в її особистому списку, якщо ні — в загальному
      const redisKey = make ? `recent_vins:${make.toUpperCase()}` : 'recent_vins';
      
      const vins = await redis.lrange(redisKey, 0, 14);
      res.status(200).json(vins || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка читання бази' });
    }
  } else if (req.method === 'POST') {
    // Тепер ми очікуємо ще й марку від фронтенду
    const { vin, make } = req.body;
    
    if (!vin || vin.length !== 17) {
      return res.status(400).json({ error: 'Невірний VIN' });
    }

    try {
      // 1. ЗАВЖДИ записуємо в загальний список (для головної сторінки)
      await redis.lrem('recent_vins', 0, vin);
      await redis.lpush('recent_vins', vin);
      await redis.ltrim('recent_vins', 0, 99);

      // 2. ЯКЩО вказана марка — записуємо ще й в окремий список цієї марки
      if (make) {
        const makeKey = `recent_vins:${make.toUpperCase()}`;
        await redis.lrem(makeKey, 0, vin);
        await redis.lpush(makeKey, vin);
        await redis.ltrim(makeKey, 0, 49); // Зберігаємо 50 останніх для кожної марки
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка запису в базу' });
    }
  } else {
    res.status(405).json({ error: 'Метод не дозволено' });
  }
}
