import { FC, ReactNode, RefObject } from "react";

type ButtonProps = {
  children?: ReactNode;
  onClick: () => void;
  ref?: RefObject<HTMLDivElement | null>;
};

const Button: FC<ButtonProps> = ({ ref, children, onClick }) => {
  return (
    <div ref={ref}>
      <button
        onClick={onClick}
        className="max-h-fit cursor-pointer inline-flex items-center justify-center rounded-md border border-transparent bg-white px-7 py-3 text-center text-base font-medium text-dark shadow-xl hover:bg-gray-200 disabled:border-gray-3 disabled:bg-gray-3 disabled:text-dark-5 dark:bg-gray-2 dark:shadow-box-dark dark:hover:bg-dark-3"
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
