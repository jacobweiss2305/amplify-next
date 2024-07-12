"use client";
import { ReactNode, useState, FunctionComponent } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';

// Define types for the props
interface GroupProps {
  title: string;
  children: ReactNode;
}

const Group: FunctionComponent<GroupProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleGroup = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={toggleGroup}
        className="flex justify-between items-center w-full p-4 focus:outline-none">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>
      {isOpen && <div className="p-4 overflow-auto max-h-96">{children}</div>}
    </div>
  );
};

export default Group;
