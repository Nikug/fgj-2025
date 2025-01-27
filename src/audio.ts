import bonk from './assets/bonk.mp3';
import gameMusic from './assets/FGJ 2025.mp3';
import waewae from './assets/waewae_waewae.mp3';
import move from './assets/move.mp3';
import attack from './assets/attack.mp3';
import perkele from './assets/processed_perkele5.wav';
import hit from './assets/hit.mp3';
import projectile from './assets/projectile.mp3';

const gameMusicAudio = new Audio(gameMusic);

const getSound = (name: string) => {
   switch (name) {
      case 'bonk':
         return bonk;
      case 'wää':
         return waewae;
      case 'move':
         return move;
      case 'attack':
         return attack;
      case 'perkele':
         return perkele;
      case 'hit':
         return hit;
      case 'projectile':
         return projectile;
      default:
         return null;
   }
};

export const playSound = (name: string, volume?: number) => {
   const sound = getSound(name);
   if (!sound) return;

   const audio = new Audio(sound);
   if (volume) audio.volume = volume;
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
