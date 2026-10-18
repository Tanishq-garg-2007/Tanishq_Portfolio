/**
 * Atmospheric Weather Configurations
 * - Sunny: 100% crisp visibility, rich blue sky, warm golden sun, ZERO whitish fog!
 * - Sunset: Deep amber/orange twilight, long dramatic shadows, floating embers.
 * - Rain: Moody slate overcast, diffuse cool light, GPU-driven rainfall particles.
 * - Night: Midnight indigo, soft silvery moonbeams, glowing lime fireflies.
 */
export const WEATHER_CONFIGS = {
  sunny: {
    id: 'sunny',
    name: 'Clear Sunny',
    icon: '☀️',
    skyColor: '#58a6ff',
    fog: null, // Zero fog = crystal clear village textures & vibrant greens
    ambientColor: '#ffffff',
    ambientIntensity: 1.35,
    hemiSky: '#93c5fd',
    hemiGround: '#86efac',
    hemiIntensity: 0.65,
    sunColor: '#fffbeb',
    sunIntensity: 2.6,
    sunPosition: [16, 24, 14],
    sparkles: {
      count: 70,
      size: 3.5,
      speed: 0.25,
      color: '#fef08a',
      opacity: 0.5
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    icon: '🌅',
    skyColor: '#ea580c',
    fog: { color: '#7c2d12', near: 48, far: 115 },
    ambientColor: '#fed7aa',
    ambientIntensity: 1.05,
    hemiSky: '#fdba74',
    hemiGround: '#9a3412',
    hemiIntensity: 0.6,
    sunColor: '#f97316',
    sunIntensity: 2.8,
    sunPosition: [28, 8, 12],
    sparkles: {
      count: 85,
      size: 3.8,
      speed: 0.35,
      color: '#fbbf24',
      opacity: 0.65
    }
  },
  rain: {
    id: 'rain',
    name: 'Cozy Rain',
    icon: '🌧️',
    skyColor: '#334155',
    fog: { color: '#1e293b', near: 40, far: 95 },
    ambientColor: '#94a3b8',
    ambientIntensity: 0.9,
    hemiSky: '#64748b',
    hemiGround: '#334155',
    hemiIntensity: 0.5,
    sunColor: '#cbd5e1',
    sunIntensity: 1.4,
    sunPosition: [12, 22, 12],
    isRain: true,
    sparkles: null
  },
  night: {
    id: 'night',
    name: 'Starry Night',
    icon: '🌙',
    skyColor: '#030712',
    fog: { color: '#020617', near: 36, far: 85 },
    ambientColor: '#1e1b4b',
    ambientIntensity: 0.6,
    hemiSky: '#312e81',
    hemiGround: '#090d16',
    hemiIntensity: 0.45,
    sunColor: '#93c5fd',
    sunIntensity: 1.25,
    sunPosition: [-16, 26, -12],
    fireflies: {
      count: 90,
      size: 4.2,
      speed: 0.4,
      color: '#86efac',
      opacity: 0.85
    }
  }
};

export const WEATHER_PRESETS = [
  { id: 'sunny', label: 'Sunny', icon: '☀️' },
  { id: 'sunset', label: 'Sunset', icon: '🌅' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'night', label: 'Night', icon: '🌙' },
];
