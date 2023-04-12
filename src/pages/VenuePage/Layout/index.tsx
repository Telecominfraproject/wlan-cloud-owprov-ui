import * as React from 'react';
import Masonry from 'react-masonry-css';
import VenueAnalyticsCard from './AnalyticsCard';
import VenueConfigurationCard from './ConfigurationCard';
import VenueInventoryCard from './InventoryCard';
import VenueContactsCard from './VenueContacts';
import VenueDetails from './VenueDetails';
import VenueNotes from './VenueNotes';
import { axiosAnalytics, axiosSec } from 'utils/axiosInstances';

type Props = {
  id: string;
};

const VenuePageLayout = ({ id }: Props) => {
  const isAnalyticsAvailable = axiosSec.defaults.baseURL !== axiosAnalytics.defaults.baseURL;

  return (
    <Masonry
      breakpointCols={{
        default: 3,
        3000: 2,
        1100: 1,
      }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      <VenueDetails id={id} />
      {isAnalyticsAvailable && <VenueAnalyticsCard id={id} />}
      <VenueInventoryCard id={id} />
      <VenueConfigurationCard id={id} />
      <VenueContactsCard id={id} />
      <VenueNotes id={id} />
    </Masonry>
  );
};

export default VenuePageLayout;
