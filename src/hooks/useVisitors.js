import { useState, useEffect } from 'react';

export function useVisitors(initial = 1312) {
  const [visitors, setVisitors] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.6) setVisitors(v => v + Math.floor(Math.random() * 2) + 1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return visitors;
}