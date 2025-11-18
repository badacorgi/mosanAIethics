// Audio objects for playback
let bgmAudio: HTMLAudioElement | null = null;
let correctAudio: HTMLAudioElement | null = null;
let incorrectAudio: HTMLAudioElement | null = null;

let isUnlocked = false;

// START: 수정된 부분 (볼륨 저장 키 및 getter/setter)
const BGM_VOLUME_KEY = 'aiQuizBgmVolume';
const DEFAULT_BGM_VOLUME = 0.2;

/**
 * localStorage에서 저장된 BGM 볼륨 값을 가져옵니다.
 * @returns 0과 1 사이의 볼륨 값
 */
export const getBGMVolume = (): number => {
  if (typeof window === 'undefined') return DEFAULT_BGM_VOLUME;
  try {
    const storedVolume = localStorage.getItem(BGM_VOLUME_KEY);
    if (storedVolume !== null) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        return volume;
      }
    }
  } catch (error) {
    console.error("Failed to get BGM volume:", error);
  }
  return DEFAULT_BGM_VOLUME;
};

/**
 * BGM 볼륨을 설정하고 localStorage에 저장합니다.
 * @param volume 0과 1 사이의 볼륨 값
 */
export const setBGMVolume = (volume: number) => {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  try {
    localStorage.setItem(BGM_VOLUME_KEY, String(clampedVolume));
  } catch (error) {
    console.error("Failed to set BGM volume in storage:", error);
  }
  
  if (bgmAudio) {
    bgmAudio.volume = clampedVolume;
  }
};
// END: 수정된 부분

// START: 수정된 부분 (Promise 반환 및 비동기 처리)
/**
 * 오디오를 초기화하고 첫 사용자 상호작용으로 잠금을 해제합니다.
 * @returns 오디오 잠금 해제 시도가 완료되면 resolve되는 Promise
 */
export const unlockAudio = (): Promise<void> => {
  if (isUnlocked || typeof window === 'undefined') {
    return Promise.resolve(); // 이미 잠금 해제됨
  }

  return new Promise((resolve, reject) => {
    try {
      bgmAudio = new Audio('/bgm.mp3');
      bgmAudio.loop = true;
      bgmAudio.volume = getBGMVolume(); // 저장된 볼륨으로 초기화

      correctAudio = new Audio('/correct.mp3');
      correctAudio.volume = 1.0; 

      incorrectAudio = new Audio('/incorrect.mp3');
      incorrectAudio.volume = 0.6;

      // BGM 대신 짧은 효과음을 사용해 오디오 잠금을 해제합니다.
      if (correctAudio) {
        correctAudio.volume = 0.01; 
        correctAudio.play().then(() => {
          correctAudio?.pause();
          if (correctAudio) { 
            correctAudio.currentTime = 0;
            correctAudio.volume = 1.0; 
          }
          isUnlocked = true; // 성공 시점에 true로 설정
          console.log("Audio unlocked");
          resolve(); // 잠금 해제 성공
        }).catch((error) => {
          console.warn("Audio unlock play failed, but proceeding:", error);
          // 재생이 실패하더라도(예: 브라우저 정책) 객체는 생성되었으므로
          // isUnlocked를 true로 설정하고 resolve 합니다.
          isUnlocked = true; 
          resolve();
        });
      } else {
        // correctAudio가 없는 예외적 상황
        isUnlocked = true;
        resolve();
      }
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      reject(error); // 오디오 객체 생성 자체 실패 시 reject
    }
  });
};
// END: 수정된 부분

// --- BGM Controls ---
export const playBGM = () => {
  if (bgmAudio) {
    // 재생 시도 전에 최신 볼륨 설정
    bgmAudio.volume = getBGMVolume();
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
