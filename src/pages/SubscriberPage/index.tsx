import React from 'react';
import { useParams } from 'react-router-dom';
import SubscriberCard from './SubscriberCard';
import SubscriberChildrenCard from './SubscriberChildrenCard';

const SubscriberPage = () => {
  const { id } = useParams();

  return id !== '' ? (
    <>
      <SubscriberCard id={id ?? ''} />
      <SubscriberChildrenCard id={id ?? ''} />
    </>
  ) : null;
};

export default SubscriberPage;
