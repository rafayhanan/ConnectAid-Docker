import React from 'react';

const Button = ({ text, onClick, type = "button", color = "bg-blue-500", textColor = "text-white" }) => {
    const hoverColor = color === 'bg-blue-500' ? 'hover:bg-blue-700' : 'hover:bg-gray-700';
return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 rounded-md ${color} ${textColor} ${hoverColor} 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {text}
    </button>
  );
};

export default Button;
