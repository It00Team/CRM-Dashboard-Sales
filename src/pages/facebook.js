import React from 'react';

const FacebookButton = ({ isActive, onClick }) => {
  return (
    <button className="vds87" onClick={onClick}>
      {isActive ? 'Stop' : 'Start'} Facebook
    </button>
  );
};

export default FacebookButton;
