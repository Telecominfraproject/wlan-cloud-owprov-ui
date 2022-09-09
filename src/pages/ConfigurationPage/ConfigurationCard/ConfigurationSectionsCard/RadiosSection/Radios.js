/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import { Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import RadioPicker from './RadioPicker';
import SingleRadio from './SingleRadio';
import RadioTab from './RadioTab';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  radioBands: PropTypes.arrayOf(PropTypes.string).isRequired,
  radioBandsLength: PropTypes.number.isRequired,
};

const Radios = ({ editing, arrayHelpers, radioBands, radioBandsLength }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleRemove = useCallback(
    (index) => () => {
      arrayHelpers.remove(index);
      if (index > 0) setTabIndex(0);
    },
    [arrayHelpers],
  );

  const handleTabsChange = useCallback((index) => {
    setTabIndex(index);
  }, []);

  if (radioBandsLength === 0) {
    <Center>
      <RadioPicker
        radios={radioBands}
        editing={editing}
        arrayHelpers={arrayHelpers}
        setTabIndex={setTabIndex}
        arrLength={radioBandsLength}
      />
    </Center>;
  }

  const tabs = useMemo(
    () =>
      Array(radioBandsLength)
        .fill(1)
        .map((el, i) => <RadioTab key={i} index={i} />),
    [editing, radioBandsLength],
  );
  const panels = useMemo(
    () =>
      Array(radioBandsLength)
        .fill(1)
        .map((el, i) => (
          <TabPanel key={i}>
            <SingleRadio namePrefix={`configuration[${i}]`} index={i} remove={handleRemove(i)} isDisabled={!editing} />
          </TabPanel>
        )),
    [editing, radioBandsLength],
  );

  return (
    <Tabs
      index={tabIndex}
      onChange={handleTabsChange}
      isLazy
      variant="enclosed-colored"
      colorScheme="blue"
      w="100%"
      px={0}
    >
      <TabList
        w="100%"
        overflowX="auto"
        style={{
          overflowY: 'hidden',
        }}
      >
        {tabs}
        <RadioPicker
          radios={radioBands}
          editing={editing}
          arrayHelpers={arrayHelpers}
          setTabIndex={setTabIndex}
          arrLength={radioBandsLength}
        />
      </TabList>
      <Card variant="widget" mb={4} borderRadius={0}>
        <CardBody display="unset">
          <TabPanels>{panels}</TabPanels>
        </CardBody>
      </Card>
    </Tabs>
  );
};

Radios.propTypes = propTypes;
export default React.memo(Radios, isEqual);
