import { ReactNode, FC } from "react";

type BodyProps = {
  children: ReactNode | null;
};

const Body: FC<BodyProps> = ({ children }: BodyProps) => {
  return <main className="px-6">{children}</main>;
};

export default Body;
