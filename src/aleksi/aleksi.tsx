import { PropsWithChildren } from 'react';

export const Star = () => {
   return <div className="star"></div>;
};

export const VilperiRow = (props: PropsWithChildren) => {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '100px',
            padding: '10px',
            border: '1px solid grey',
         }}
      >
         {props.children}
      </div>
   );
};

interface AleksiBoxProps extends PropsWithChildren {
   size: 'small' | 'medium' | 'large';
}

export const AleksiBox = (props: AleksiBoxProps) => {
   const { size, children } = props;

   const modelSize = {
      small: '50px',
      medium: '100px',
      large: '200px',
   }[size];

   return (
      <div
         style={{
            border: '1px solid white',
            height: modelSize,
            width: modelSize,
         }}
      >
         {children}
      </div>
   );
};
export const Aleksi = () => {
   return (
      <div
         style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '100px',
         }}
      >
         <VilperiRow>
            <AleksiBox size="small">
               <Star />
            </AleksiBox>
            <AleksiBox size="medium">
               <Star />
            </AleksiBox>
            <AleksiBox size="large">
               <Star />
            </AleksiBox>
         </VilperiRow>
      </div>
   );
};
