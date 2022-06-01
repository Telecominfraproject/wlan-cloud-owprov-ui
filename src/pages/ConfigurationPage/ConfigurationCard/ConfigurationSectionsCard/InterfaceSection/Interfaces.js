/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import SingleInterface from './SingleInterface';
import CreateInterfaceButton from './CreateInterfaceButton';
import InterfaceTab from './InterfaceTab';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  interfacesLength: PropTypes.number.isRequired,
};

const Interfaces = ({ editing, arrayHelpers, interfacesLength }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleRemove = (index) => {
    arrayHelpers.remove(index);
    if (index > 0) setTabIndex(0);
  };

  const handleTabsChange = useCallback((index) => {
    setTabIndex(index);
  }, []);

  if (interfacesLength === 0) {
    return (
      <Center>
        <CreateInterfaceButton
          editing={editing}
          arrayHelpers={arrayHelpers}
          setTabIndex={setTabIndex}
          arrLength={interfacesLength}
        />
      </Center>
    );
  }
  return (
    <Tabs
      index={tabIndex}
      onChange={handleTabsChange}
      isLazy
      variant="enclosed-colored"
      w="100%"
      px={0}
      colorScheme="blue"
    >
      <TabList
        w="100%"
        overflowX="auto"
        style={{
          overflowY: 'hidden',
        }}
      >
        {Array(interfacesLength)
          .fill(1)
          .map((el, i) => (
            <InterfaceTab key={i} index={i} />
          ))}
        <CreateInterfaceButton
          editing={editing}
          arrayHelpers={arrayHelpers}
          setTabIndex={setTabIndex}
          arrLength={interfacesLength}
        />
      </TabList>
      <Card variant="widget" mb={4} borderRadius={0}>
        <CardBody display="unset">
          <TabPanels>
            {Array(interfacesLength)
              .fill(1)
              .map((el, i) => (
                <TabPanel overflowX="auto" px={0} key={i}>
                  <SingleInterface index={i} remove={handleRemove} editing={editing} />
                </TabPanel>
              ))}
          </TabPanels>
        </CardBody>
      </Card>
    </Tabs>
  );
};

Interfaces.propTypes = propTypes;
export default React.memo(Interfaces);
