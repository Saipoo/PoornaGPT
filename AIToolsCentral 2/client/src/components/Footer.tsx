import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">© 2025 PoornaGPT. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
