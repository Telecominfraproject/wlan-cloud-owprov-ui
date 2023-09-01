import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, useColorMode } from '@chakra-ui/react';
import Masonry from 'react-masonry-css';
import VenueBehaviorsCard from './BehaviorsCard';
import VenueConfigurationsCard from './Configuration';
import VenueContactsCard from './ContactsCard';
import VenueDetailsCard from './DetailsCard';
import VenueInventoryCard from './InventoryCard';
import VenueMonitoringTab from './Monitoring';
import VenueResourcesCard from './Resources';
import VenueNotes from './VenueNotes';

const SETTING = 'provisioning.venue.tabIndex';

const getDefaultTabIndex = (hasAnalytics: boolean) => {
  const tabIndex = localStorage.getItem(SETTING);

  if (!hasAnalytics) {
    return 0;
  }

  try {
    if (tabIndex) {
      const parsedTabIndex = parseInt(tabIndex, 10);
      if (parsedTabIndex >= 0 && parsedTabIndex <= 1) {
        return parsedTabIndex;
      }
    }

    return 0;
  } catch (e) {
    return 0;
  }
};

type Props = {
  id: string;
  hasAnalytics: boolean;
};

const VenuePageLayout = ({ id, hasAnalytics }: Props) => {
  const [tabIndex, setTabIndex] = React.useState(getDefaultTabIndex(hasAnalytics));
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  const tabStyle = {
    textColor: isLight ? 'var(--chakra-colors-blue-600)' : 'var(--chakra-colors-blue-300)',
    fontWeight: 'semibold',
    borderWidth: '0px',
    marginBottom: '-1px',
    borderBottom: '2px solid',
  };

  const onTabChange = (index: number) => {
    setTabIndex(index);
    localStorage.setItem(SETTING, index.toString());
  };

  React.useEffect(() => {
    setTabIndex(getDefaultTabIndex(hasAnalytics));
  }, [id]);

  return (
    <Tabs index={tabIndex} onChange={onTabChange}>
      <TabList>
        <Tab _selected={tabStyle}>Management</Tab>
        <Tooltip
          label={
            hasAnalytics
              ? ''
              : 'Monitoring not activated on this venue. Please use the "Monitoring" button on the top-right of the screen to activate it'
          }
        >
          <Box>
            <Tab _selected={tabStyle} isDisabled={!hasAnalytics}>
              Monitoring
            </Tab>
          </Box>
        </Tooltip>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <Masonry
            breakpointCols={{
              default: 3,
              3000: 2,
              1100: 1,
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            <VenueDetailsCard id={id} />
            <VenueBehaviorsCard id={id} />
            <VenueInventoryCard id={id} />
            <VenueConfigurationsCard id={id} />
            <VenueResourcesCard id={id} />
            <VenueContactsCard id={id} />
            <VenueNotes id={id} />
          </Masonry>
        </TabPanel>
        <TabPanel px={0}>{hasAnalytics ? <VenueMonitoringTab venueId={id} /> : null}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default VenuePageLayout;
