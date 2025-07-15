import { ReactNode, FC } from 'react';

type BodyProps = {
  children: ReactNode | null;
};

const Body: FC<BodyProps> = ({ children }: BodyProps) => {
  return (
    <main className='w-full max-w-full'>
      <div className='text-gray-900 dark:text-gray-100 transition-colors duration-300'>
        {children}
      </div>
    </main>
  );
};

export default Body;
