import React from 'react';
import { useParams } from 'react-router-dom';
import OperatorChildrenCard from './ChildrenCard';
import DetailsCard from './DetailsCard';

const OperatorPage = ({ idToUse }: { idToUse?: string }) => {
  const { id } = useParams();

  const entityIdToUse = React.useMemo(() => {
    if (id !== undefined && id !== '') {
      return id;
    }
    if (idToUse !== undefined && idToUse !== '') {
      return idToUse;
    }

    return undefined;
  }, [idToUse, id]);

  return entityIdToUse !== undefined ? (
    <>
      <DetailsCard id={entityIdToUse} />
      <OperatorChildrenCard id={entityIdToUse} />
    </>
  ) : null;
};

export default OperatorPage;
