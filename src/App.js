import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './pages/ChatPage';
import Homepage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/chats' element={<ChatPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
