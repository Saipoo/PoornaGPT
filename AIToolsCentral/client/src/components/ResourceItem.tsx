import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Resource } from '@/types';

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
  return (
    <li className="px-4 py-4 flex items-center justify-between">
      <div>
        <h3 className="text-gray-900 dark:text-white font-medium">{resource.name}</h3>
      </div>
      <a 
        href={resource.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-primary hover:text-primary-dark dark:text-primary-light flex items-center"
      >
        <span className="mr-1">Visit</span>
        <ExternalLink size={16} />
      </a>
    </li>
  );
};

export default ResourceItem;
