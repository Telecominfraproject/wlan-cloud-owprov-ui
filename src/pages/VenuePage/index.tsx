import React from 'react';
import { useParams } from 'react-router-dom';
import VenuePageLayout from './Layout';
import VenuePageHeader from './VenueHeader';
import { useGetAnalyticsBoardDevices } from 'hooks/Network/Analytics';
import { useGetVenue } from 'hooks/Network/Venues';
import { axiosAnalytics, axiosSec } from 'utils/axiosInstances';

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

  const getVenue = useGetVenue({ id });
  const isAnalyticsAvailable = axiosSec.defaults.baseURL !== axiosAnalytics.defaults.baseURL;
  const boardId = getVenue.data?.boards[0];
  const getDashboard = useGetAnalyticsBoardDevices({ id: isAnalyticsAvailable ? boardId : undefined });

  return entityIdToUse ? (
    <>
      <VenuePageHeader
        id={entityIdToUse}
        boardId={!getDashboard.isLoading && !getDashboard.error ? boardId : undefined}
      />
      <VenuePageLayout id={entityIdToUse} hasAnalytics={!getDashboard.isLoading && !getDashboard.error} />
    </>
  ) : null;
};

export default VenuePage;
