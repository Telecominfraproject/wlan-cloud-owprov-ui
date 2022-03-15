import React from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@chakra-ui/react';
import CreateSsidButton from './CreateSsidButton';
import SingleSsid from './SingleSsid';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  ssidsLength: PropTypes.number.isRequired,
};

const SsidList = ({ editing, index, arrayHelpers, ssidsLength }) => (
  <>
    <Heading size="md" mb={4}>
      SSIDs ({ssidsLength})
    </Heading>
    {Array(ssidsLength)
      .fill(1)
      .map((el, i) => (
        <SingleSsid
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          index={i}
          namePrefix={`configuration[${index}].ssids[${i}]`}
          remove={arrayHelpers.remove}
          editing={editing}
        />
      ))}
    <CreateSsidButton editing={editing} pushSsid={arrayHelpers.push} />
  </>
);

SsidList.propTypes = propTypes;
export default SsidList;
