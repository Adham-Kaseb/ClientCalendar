import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  dotColor?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#F8FAFC] hover:bg-white border border-[#CBD5E1] hover:border-[#0E6875] rounded-[14px] px-4 py-2.5 text-xs md:text-sm font-extrabold text-[#0F172A] shadow-subtle hover:shadow-teal transition-all flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
      >
        <div className="flex items-center gap-2.5 truncate">
          {icon}
          {selectedOption?.dotColor && (
            <span className={`w-2.5 h-2.5 rounded-full ${selectedOption.dotColor}`} />
          )}
          <span className="truncate">{selectedOption?.label}</span>
        </div>

        <ChevronDown className={`w-4 h-4 text-[#0E6875] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-[200px] bg-white rounded-[18px] shadow-card-heavy border border-[#E2E8F0] z-[99999] overflow-hidden py-1.5 animate-fadeIn">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-right px-4 py-2.5 text-xs md:text-sm font-bold flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? 'bg-[#E6F3F5] text-[#0E6875] font-black'
                    : 'text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#0E6875]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {opt.dotColor && (
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#0E6875] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CustomSelect;
