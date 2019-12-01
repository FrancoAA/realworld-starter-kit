import { useState } from 'react';

export function usePaginator({ offset, pageSize }) {
  const [paginator, setPaginator] = useState({ offset: offset || 0, limit: pageSize || 10 });

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


