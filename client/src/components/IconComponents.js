import React from 'react';

// IconButton Component
export function IconButton({ children, text, iconColor, onClick, ...props }) {
  return (
    <button
      {...props}
      onClick={onClick} // Déclenche la fonction passée en prop
      className='text-lg border text-stone-600 flex justify-center items-center gap-x-2 block w-1/2 py-3 text-blue-google my-3'
    >
      {children}
      <div className='font-semibold text-base text-gray-500'>{text}</div>
    </button>
  );
}

// IconInput Component
export function IconInput({ children, placeholder, type, value, onChange }) {
  return (
    <div className='flex justify-left items-center w-full relative h-12 border mt-4'>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='w-full p-3 pl-10 border'
        required
      />
      <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
        {children}
      </div>
    </div>
  );
}
