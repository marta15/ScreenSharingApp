import './App.css';
import { useState, useEffect } from 'react';


import Participant from './components/Participant';
import Presenter from './components/Presenter';
import Api from './api/websocket';

function App() {
  const [role, setRole] = useState('');

  const processRole = (event: { data: string; }) => {
    const response = JSON.parse(event.data);
    if (response.data?.role === 1) {
      setRole('presenter');
    }
    else if (response.data?.role === 0) {
      setRole('participant');
    }
  };

  useEffect(() => {
    Api.subscribeToMessage("role", processRole);
  }, []);


  Api.openConnection(() => {
    setRole('');
  });

  if (role === 'participant') {
    return (
      <div className="App">
        <Participant />
      </div>
    );
  }
  else if (role === 'presenter') {
    return (
      <div className="App">
        <Presenter />
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <h1>Conference screen sharing</h1>
        <h2>Waiting for the server...</h2>
      </div>
    );
  }

}

export default App;
