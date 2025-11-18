const createAudioContext = (): AudioContext | null => {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (e) {
    console.warn("Web Audio API is not supported in this browser");
    return null;
  }
};

const audioContext = createAudioContext();

function playSound(type: 'select') {
  if (!audioContext) return;
  if (audioContext.state === 'suspended') {
      audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);

  switch(type) {
    case 'select':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, now); // A4
      break;
  }

  oscillator.start(now);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
  oscillator.stop(now + 0.2);
}

export const playSelectSound = () => playSound('select');
