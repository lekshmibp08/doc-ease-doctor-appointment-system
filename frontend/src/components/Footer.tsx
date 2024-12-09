import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between p-4 text-sm bg-customTeal border-t border-customTeal">
        <div>DocEase.com</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
    </footer>
    
  );
};

export default Footer;



