import bonk from './assets/bonk.mp3';
import gameMusic from './assets/FGJ 2025.mp3';

const gameMusicAudio = new Audio(gameMusic);

const getSound = (name: string) => {
   switch (name) {
      case 'bonk':
         return bonk;
      default:
         return null;
   }
};

export const playSound = (name: string) => {
   const sound = getSound(name);
   if (!sound) return;

   const audio = new Audio(sound);
   audio.play();
};

export const startGameMusic = () => {
   gameMusicAudio.loop = true;
   gameMusicAudio.volume = 0.2;
   gameMusicAudio.play();
};

export const stopGameMusic = () => {
   gameMusicAudio.pause();
   gameMusicAudio.currentTime = 0;
};
