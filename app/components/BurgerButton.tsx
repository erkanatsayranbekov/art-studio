interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function BurgerButton({ isOpen, onClick }: BurgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-6 h-6 relative flex items-center justify-center">
        <span
          className={`absolute w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 ${
            isOpen ? "rotate-45" : "-translate-y-2"
          }`}
        />
        <span
          className={`absolute w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute w-full h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 ${
            isOpen ? "-rotate-45" : "translate-y-2"
          }`}
        />
      </div>
    </button>
  );
} 