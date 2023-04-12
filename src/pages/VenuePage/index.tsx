import React from 'react';
import { useParams } from 'react-router-dom';
import VenuePageLayout from './Layout';
import VenuePageHeader from './VenueHeader';

const VenuePage = ({ idToUse }: { idToUse?: string }) => {
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
      <VenuePageHeader id={entityIdToUse} />
      <VenuePageLayout id={entityIdToUse} />
    </>
  ) : null;
};

export default VenuePage;
