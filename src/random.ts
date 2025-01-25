export const shuffleList = <T>(list: T[]): T[] => {
   const newList = [...list];
   for (var i = newList.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newList[i];
      newList[i] = newList[j];
      newList[j] = temp;
   }

   return newList;
};
