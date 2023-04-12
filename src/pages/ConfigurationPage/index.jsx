import React from 'react';
import { useParams } from 'react-router-dom';
import ConfigurationCard from './ConfigurationCard';

const ConfigurationPage = () => {
  const { id } = useParams();

  return id !== '' ? <ConfigurationCard id={id} /> : null;
};

export default ConfigurationPage;
