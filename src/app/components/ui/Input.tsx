import React, { forwardRef } from "react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  className?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type,
      placeholder,
      label,
      showPasswordToggle,
      showPassword,
      onTogglePassword,
      className,
      error,
      value,
      onChange,
      onBlur,
    },
    ref
  ) => (
    <div className={`flex flex-col justify-start mb-7 ${className}`}>
      <label htmlFor={id} className="mb-2 text-sm text-start text-grey-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium bg-white border outline-none rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute transform -translate-y-1/2 right-4 top-1/2 text-grey-600"
            onClick={onTogglePassword}
          >
            {showPassword ? <BiSolidShow /> : <BiSolidHide />}
          </button>
        )}
      </div>
      {error && (
        <div className="my-1 text-sm text-left text-red-600">{error}</div>
      )}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;
