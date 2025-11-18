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

    // START: 수정된 부분
    // BGM 대신 짧은 효과음을 사용해 오디오 잠금을 해제합니다.
    // 이렇게 하면 BGM의 play/pause가 꼬이지 않습니다.
    if (correctAudio) {
      correctAudio.volume = 0.01; // 아주 작게
      correctAudio.play().then(() => {
        correctAudio?.pause();
        if (correctAudio) { // null 체크 추가
          correctAudio.currentTime = 0;
          correctAudio.volume = 1.0; // 볼륨 원상복구
        }
      }).catch(() => {});
    }
    // END: 수정된 부분
    
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
