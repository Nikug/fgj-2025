interface Props {
   children: React.ReactNode;
}

export const AbsoluteWrapper = (props: Props) => {
   return <div className="absolute-wrapper">{props.children}</div>;
};
