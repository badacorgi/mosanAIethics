// Audio objects for playback
let bgmAudio: HTMLAudioElement | null = null;
let correctAudio: HTMLAudioElement | null = null;
let incorrectAudio: HTMLAudioElement | null = null;

let isUnlocked = false;

// Function to initialize and unlock audio on the first user interaction
export const unlockAudio = () => {
  if (isUnlocked || typeof window === 'undefined') return;

  try {
    bgmAudio = new Audio('/bgm.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.3;

    correctAudio = new Audio('/correct.mp3');
    incorrectAudio = new Audio('/incorrect.mp3');

    // A tiny silent audio play to unlock on iOS and other browsers
    bgmAudio.play().then(() => bgmAudio?.pause()).catch(() => {});
    
    isUnlocked = true;
    console.log("Audio unlocked");
  } catch (error) {
    console.error("Failed to initialize audio:", error);
  }
};

// --- BGM Controls ---
export const playBGM = () => {
  if (bgmAudio) {
    bgmAudio.currentTime = 0;
    bgmAudio.play().catch(error => console.warn("BGM play failed:", error));
  }
};

export const stopBGM = () => {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
};

// --- Sound Effect Controls ---
export const playCorrectSound = () => {
  if (correctAudio) {
    correctAudio.currentTime = 0;
    correctAudio.play().catch(error => console.warn("Correct sound play failed:", error));
  }
};

export const playIncorrectSound = () => {
  if (incorrectAudio) {
    incorrectAudio.currentTime = 0;
    incorrectAudio.play().catch(error => console.warn("Incorrect sound play failed:", error));
  }
};
