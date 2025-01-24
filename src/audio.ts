import bonk from './assets/bonk.mp3';

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
