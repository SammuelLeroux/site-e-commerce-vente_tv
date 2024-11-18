import React from 'react';
import style from './Footer.module.css';

const Footer:React.FC = () => {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className={style.footer}>
        &copy; {currentYear} e-Commerce by STG_20
    </footer>
  );
};

export default Footer;