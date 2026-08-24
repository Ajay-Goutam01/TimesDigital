import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const defaultTitle = 'TIME Public School & TIMES DIGITAL | Premier CBSE & Coaching in Shahdol';
    if (title) {
      document.title = `${title} | TIME Public School & TIMES DIGITAL`;
    } else {
      document.title = defaultTitle;
    }
  }, [title]);
};
