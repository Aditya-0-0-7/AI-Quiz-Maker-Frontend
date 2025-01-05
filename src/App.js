import { useState } from 'react';
import './App.css';
import Home from './components/home'; 
import NavBar from './components/navBar';
import GenerateQuiz from './components/generateQuiz';
import JoinQuiz from './components/joinQuiz';
import ViewQuiz from './components/viewQuiz';
import Loading from './utilities/loading';
import Toast from './utilities/toast';

function App() {
  const [page,setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("hello your quiz has generated successfully");

  function triggerToast(msg)
  {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(()=>{ 
      setShowToast(false);
    },3000);
  }

  return (
    <main>
      {<NavBar setPage={setPage} page={page}/>}
      {isLoading&&<Loading />}
      {showToast&&<Toast msg={toastMsg}/>}
      {page===0&&<Home />}
      {page===1&&<GenerateQuiz setLoading={setLoading} triggerToast={triggerToast}/>}
      {page===2&&<JoinQuiz setLoading={setLoading} triggerToast={triggerToast}/>}
      {page===3&&<ViewQuiz setLoading={setLoading} triggerToast={triggerToast}/>}
    </main>
  );
}

export default App;
