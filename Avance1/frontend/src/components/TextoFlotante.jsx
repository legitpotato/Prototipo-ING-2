import { useState } from 'react';

export function FloatingInput({ label, name, type, register, error, validation }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full my-6">
      <input
        id={name}
        type={type}
        {...register(name, {
          ...validation,
          onChange: (e) => setHasValue(e.target.value !== ''),
        })}
        onInput={(e) => {
          if (name === 'rut') {
            e.target.value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
          }
        }}

        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== '');
        }}
        placeholder=" "
        className="w-full bg-zinc-300 text-black placeholder-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 cursor-text ${
          isFocused || hasValue
            ? 'text-base -top-7 text-purple-600'
            : 'top-3 text-sm text-black'
        }`}
      >
        {label}
      </label>
      {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
