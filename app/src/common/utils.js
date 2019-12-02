import { useState } from 'react';

export function usePaginator() {
  const [paginator, setPaginator] = useState({ offset: 0, limit: 10 });

  const nextPage = () => {
    setPaginator(prev => ({
      offset: prev.offset + prev.limit,
      limit: prev.limit
    }));
  };

  return [paginator, nextPage];
}

export function getProp(object, path, defaultValue) {
  let arrPath = path.split('.');
  return arrPath.reduce((obj, prop) => {
    return (obj && obj[prop]) || defaultValue;
  }, object);
}


