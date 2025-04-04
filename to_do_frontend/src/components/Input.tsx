import { ChangeEvent, FC, ReactNode } from "react";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  type?: "password" | "text" | "number" | "email";
  placeHolder?: string;
  onSubmit: () => void;
  children: ReactNode;
};

const Input: FC<InputProps> = ({
  type,
  value,
  placeHolder,
  onFocus,
  onChange,
  onSubmit,
  children,
}: InputProps) => {
  return (
    <>
      {children}
      <input
        id="input-text"
        type={type}
        placeholder={placeHolder}
        value={value}
        className="rounded-lg dark:bg-gray-500 dark:text-gray-200 bg-gray-200 text-gray-900 p-2.5 w-full"
        onFocus={onFocus}
        onSubmit={onSubmit}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const newValue =
            type === "number" ? Number(e.target.value) : e.target.value;
          onChange(newValue as any);
        }}
      ></input>
    </>
  );
};

export default Input;
