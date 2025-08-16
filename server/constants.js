const AVAILABLE_ICONS = [
  'battle', 'fleet', 'memorial', 'treaty', 'photo', 
  'birthplace', 'death', 'unknown', 'celebrity', 'invention'
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = { AVAILABLE_ICONS, JWT_SECRET };