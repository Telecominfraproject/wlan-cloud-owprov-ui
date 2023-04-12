import React from 'react';
import { useParams } from 'react-router-dom';
import EntityPageHeader from './EntityHeader';
import EntityPageLayout from './Layout';

const EntityPage = ({ idToUse }: { idToUse?: string }) => {
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

  return entityIdToUse ? (
    <>
      <EntityPageHeader id={entityIdToUse} />
      <EntityPageLayout id={entityIdToUse} />
    </>
  ) : null;
};

export default EntityPage;
