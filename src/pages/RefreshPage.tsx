import { useState, useEffect } from 'react';

function RefreshPage() {
  const [data, setData] = useState('Loading...');

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, []);

  const alertUser = (e: Event) => {
    e.preventDefault();
  };

  const getData = () => {
    fetch('https://api.adviceslip.com/advice')
      .then((response) => response.json())
      .then((data) => {
        setData(data.slip.advice);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  window.addEventListener('beforeunload', () => {
    getData();
    console.log('API call before page reload');
  });

  window.addEventListener('unload', () => {
    getData();
    console.log('API call after page reload');
  });

  return (
    <div>
      <h1>GeeksforGeeks</h1>
      <h3>{data}</h3>
    </div>
  );
}

export default RefreshPage;
