
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/formatter1")
  }, [])
 
  return <></>
}

export default Home;
