import React from 'react';

// Define a functional button component
function MyButton(props) {
  // Destructure props for easier access
  const { text, onClick, className } = props;

  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
}

export default MyButton;
