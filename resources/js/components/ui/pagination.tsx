import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface Props {
  links?: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  current_page?: number;
  from?: number;
  last_page?: number;
  path?: string;
  per_page?: number;
  to?: number;
  total?: number;
}

export function Pagination(props: Props) {
  // Handle both formats: direct links array or meta object from Laravel pagination
  const { links, current_page, last_page, path } = props;

  // If direct links array is provided
  if (links) {
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
              {isPrevious ? '«' : isNext ? '»' : label}
            </Link>
          ) : (
            <span
              key={key}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md"
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  }
  
  // If meta object is provided (format from Laravel pagination in Inertia)
  if (current_page && last_page && path) {
    // Don't render pagination if there's only 1 page
    if (last_page <= 1) {
      return null;
    }
    
    const pageNumbers: number[] = [];
    
    // Always show first and last page, and a few around the current page
    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 || // First page
        i === last_page || // Last page
        (i >= current_page - 2 && i <= current_page + 2) // Pages around current
      ) {
        pageNumbers.push(i);
      } else if (
        (i === current_page - 3 && current_page > 3) || // Ellipsis before
        (i === current_page + 3 && current_page < last_page - 2) // Ellipsis after
      ) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
    }
    
    // Remove duplicates (in case ranges overlap)
    const uniquePageNumbers = pageNumbers.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    
    return (
      <div className="flex flex-wrap justify-center gap-1">
        {current_page > 1 && (
          <Link
            href={`${path}?page=${current_page - 1}`}
            className="px-3 py-2 text-sm bg-white text-gray-700 hover:bg-gray-50 rounded-md"
          >
            «
          </Link>
        )}
        
        {uniquePageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-sm text-gray-500 rounded-md"
              >
                ...
              </span>
            );
          }
          
          const isActive = pageNumber === current_page;
          
          return (
            <Link
              key={`page-${pageNumber}`}
              href={`${path}?page=${pageNumber}`}
              className={clsx(
                'px-4 py-2 text-sm rounded-md',
                {
                  'bg-primary text-white': isActive,
                  'bg-white text-gray-700 hover:bg-gray-50': !isActive,
                }
              )}
            >
              {pageNumber}
            </Link>
          );
        })}
        
        {current_page < last_page && (
          <Link
            href={`${path}?page=${current_page + 1}`}
            className="px-3 py-2 text-sm bg-white text-gray-700 hover:bg-gray-50 rounded-md"
          >
            »
          </Link>
        )}
      </div>
    );
  }
  
  // If neither format is provided correctly
  return null;
}
