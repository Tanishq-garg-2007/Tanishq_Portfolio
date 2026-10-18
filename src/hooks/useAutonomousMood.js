import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Returns a personality-tailored mood pool for each Pokémon companion
 */
export function getPersonalityMoodPool(pokemonId) {
  switch (pokemonId) {
    case 'snorlax':
      return ['sleep', 'sleep', 'idle', 'walk'];
    case 'charmander':
      return ['happy', 'walk', 'happy', 'idle'];
    case 'dragonite':
      return ['happy', 'walk', 'idle', 'happy'];
    case 'gengar':
      return ['attack', 'walk', 'idle', 'happy'];
    case 'psyduck':
      return ['idle', 'walk', 'idle', 'sleep'];
    case 'jigglypuff':
      return ['happy', 'walk', 'happy', 'idle'];
    case 'mew':
      return ['run', 'run', 'idle', 'happy'];
    default:
      return ['walk', 'walk', 'idle', 'happy', 'sleep'];
  }
}

/**
 * Custom hook to manage autonomous mood transitions and animation playback
 *
 * @param {Object} params
 * @param {string} params.pokemonId
 * @param {string} params.defaultAnim
 * @param {boolean} params.isInteracting
 * @param {Object} params.actions - Animation actions from useAnimations
 */
export function useAutonomousMood({ pokemonId, defaultAnim = 'idle', isInteracting, actions }) {
  const currentAction = useRef(null);
  const [currentMood, setCurrentMood] = useState(defaultAnim);
  const [cycleCount, setCycleCount] = useState(0);

  const moodPool = useMemo(() => getPersonalityMoodPool(pokemonId), [pokemonId]);

  // Cross-fade animation transition helper
  const playAnimation = (animName, duration = 0.4) => {
    if (!actions || !animName) return;
    const targetKey = Object.keys(actions).find((k) => k.toLowerCase() === animName.toLowerCase());

    if (!targetKey) {
      // Do not silently play the first clip when missing
      return;
    }

    const targetAction = actions[targetKey];
    if (!targetAction) return;

    if (currentAction.current === targetAction && targetAction.isRunning()) {
      return;
    }

    if (currentAction.current && currentAction.current !== targetAction) {
      currentAction.current.fadeOut(duration);
    }
    targetAction.reset().fadeIn(duration).play();
    currentAction.current = targetAction;
  };

  // Autonomous Mood Cycle Scheduler (keyed to cycleCount so picked mood duplicates never freeze the cycle)
  useEffect(() => {
    if (isInteracting) return;

    let timeoutId;
    const scheduleNextMood = () => {
      // Walking duration: 14 to 24s. Resting/emotion duration: 8 to 15s.
      const isWalking = currentMood === 'walk' || currentMood === 'run';
      const durationMs = isWalking
        ? (14 + Math.random() * 10) * 1000
        : (8 + Math.random() * 7) * 1000;

      timeoutId = setTimeout(() => {
        if (!isInteracting) {
          const nextMood = moodPool[Math.floor(Math.random() * moodPool.length)] || 'idle';
          setCurrentMood(nextMood);
          setCycleCount((c) => c + 1);
        }
      }, durationMs);
    };

    scheduleNextMood();
    return () => clearTimeout(timeoutId);
  }, [cycleCount, isInteracting, moodPool, currentMood]);

  // Synchronize 3D skeletal animation with active mood / visitor interaction
  useEffect(() => {
    if (isInteracting) {
      if (currentMood === 'sleep' && pokemonId === 'snorlax') {
        playAnimation('sleep');
      } else {
        playAnimation('happy');
      }
    } else {
      playAnimation(currentMood);
    }
  }, [isInteracting, currentMood, actions, pokemonId]);

  const isMoving = (currentMood === 'walk' || currentMood === 'run') && !isInteracting;

  return {
    currentMood,
    isMoving,
  };
}
