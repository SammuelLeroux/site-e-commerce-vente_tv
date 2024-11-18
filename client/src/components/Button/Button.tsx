import React from 'react';

import style from './Button.module.css';

interface ButtonProps {
  text: string;
  type: string;
  style?: Object;
  onClick?: (x:any) => void;
}

const Button:React.FC<ButtonProps> = (props: ButtonProps) => {
  
  return (
    <button
      type={props.type === 'submit' ? "submit" : "button"}
      className={style.button}
      style={props.style}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default Button;