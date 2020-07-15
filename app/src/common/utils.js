import { useState } from 'react';

export function usePaginator() {
  const [paginator, setPaginator] = useState({ offset: 0, limit: 10 });

  const nextPage = () => {
    setPaginator(prev => ({
      offset: 0,
      limit: prev.limit + 10
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


