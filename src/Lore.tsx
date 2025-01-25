import Marquee from 'react-fast-marquee';

export function Lore() {
   // A lore about a mad scientist who created a master liquid that exploded and created bubbles that started to figth each other.
   let lore =
      'Once upon a time, a mad scientist created a master liquid that exploded and created bubbles that started to figth each other. ';

   lore =
      lore +
      ' The scientist was so happy that he started to create more and more bubbles. ';
   lore =
      lore +
      ' The bubbles started to evolve and they started to create their own weapons.';

   return (
      <div className="lore">
         <Marquee>{lore}</Marquee>
      </div>
   );
}
