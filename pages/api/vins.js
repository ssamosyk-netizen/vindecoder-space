import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const vins = await redis.lrange('recent_vins', 0, 14);
      res.status(200).json(vins || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка читання бази' });
    }
  } else if (req.method === 'POST') {
    const { vin } = req.body;
    
    if (!vin || vin.length !== 17) {
      return res.status(400).json({ error: 'Невірний VIN' });
    }

    try {
      await redis.lrem('recent_vins', 0, vin);
      await redis.lpush('recent_vins', vin);
      await redis.ltrim('recent_vins', 0, 99);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Помилка запису в базу' });
    }
  } else {
    res.status(405).json({ error: 'Метод не дозволено' });
  }
}
