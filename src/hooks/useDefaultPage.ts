import { useNavigate } from 'react-router-dom';

const useDefaultPage = () => {
  const navigate = useNavigate();

  const goToDefaultPage = () => navigate('/operators');

  return goToDefaultPage;
};

export default useDefaultPage;
