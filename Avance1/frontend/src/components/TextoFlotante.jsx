import { useState } from 'react';

export function FloatingInput({ label, name, type, register, error }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative w-full my-6">
      <input
        id={name}
        type={type}
        {...register(name, {
          required: `${label} es requerido`,
          onChange: (e) => setHasValue(e.target.value !== ''),
        })}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== '');
        }}
        placeholder=" "  // <-- placeholder vacío para reservar espacio sin mostrar texto
        className="w-full bg-zinc-300 text-black placeholder-transparent px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 cursor-text ${
          isFocused || hasValue
            ? 'text-base -top-7 text-purple-600'  // label arriba y morado
            : 'top-3 text-sm text-black'         // label dentro y negro
        }`}
      >
        {label}
      </label>
      {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
