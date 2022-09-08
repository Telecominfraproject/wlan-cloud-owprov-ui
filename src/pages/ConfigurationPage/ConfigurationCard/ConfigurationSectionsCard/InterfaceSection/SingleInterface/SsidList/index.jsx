/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import CreateSsidButton from './CreateSsidButton';
import SingleSsid from './SingleSsid';
import SsidTab from './SsidTab';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  ssidsLength: PropTypes.number.isRequired,
};

const SsidList = ({ editing, index, arrayHelpers, ssidsLength }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleRemove = (newIndex) => {
    arrayHelpers.remove(newIndex);
    if (newIndex > 0) setTabIndex(0);
  };

  const handleTabsChange = useCallback((newIndex) => {
    setTabIndex(newIndex);
  }, []);

  if (ssidsLength === 0) {
    return (
      <Center>
        <CreateSsidButton editing={editing} pushSsid={arrayHelpers.push} />
      </Center>
    );
  }
  return (
    <Tabs index={tabIndex} onChange={handleTabsChange} isLazy variant="enclosed-colored" w="100%" colorScheme="blue">
      <TabList
        w="100%"
        overflowX="auto"
        style={{
          overflowY: 'hidden',
        }}
      >
        {Array(ssidsLength)
          .fill(1)
          .map((el, i) => (
            <SsidTab key={i} index={i} interIndex={index} />
          ))}
        <CreateSsidButton
          editing={editing}
          pushSsid={arrayHelpers.push}
          setTabIndex={setTabIndex}
          arrLength={ssidsLength}
        />
      </TabList>
      <TabPanels>
        {Array(ssidsLength)
          .fill(1)
          .map((el, i) => (
            <TabPanel overflowX="auto" p={0} key={i}>
              <SingleSsid
                index={i}
                namePrefix={`configuration[${index}].ssids[${i}]`}
                remove={handleRemove}
                editing={editing}
              />
            </TabPanel>
          ))}
      </TabPanels>
    </Tabs>
  );
};

SsidList.propTypes = propTypes;
export default SsidList;
