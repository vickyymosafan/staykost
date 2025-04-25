import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface Props {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export function Pagination({ links }: Props) {
  // Don't render pagination if there's only 1 page
  if (links.length <= 3) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {links.map((link, key) => {
        // Remove "&laquo;" and "&raquo;" entities
        const label = link.label.replace(/&laquo;\s*/, '').replace(/&raquo;\s*/, '');
        
        // Detect prev/next links
        const isPrevious = link.label.includes('&laquo;');
        const isNext = link.label.includes('&raquo;');
        
        if (!link.url && !link.active) {
          return (
            <span 
              key={key}
              className="px-4 py-2 text-sm text-gray-500 rounded-md"
            >
              ...
            </span>
          );
        }

        return link.url ? (
          <Link
            key={key}
            href={link.url}
            className={clsx(
              'px-4 py-2 text-sm rounded-md',
              {
                'bg-primary text-white': link.active,
                'bg-white text-gray-700 hover:bg-gray-50': !link.active,
                'px-3': isPrevious || isNext,
              }
            )}
          >
            {isPrevious ? '← Previous' : isNext ? 'Next →' : label}
          </Link>
        ) : (
          <span
            key={key}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
