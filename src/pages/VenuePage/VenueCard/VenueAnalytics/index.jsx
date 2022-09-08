import React from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import AnalyticsBoardForm from 'components/CustomFields/AnalyticsBoardForm';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  venueName: PropTypes.string.isRequired,
};

const VenueAnalytics = ({ editing, venueName }) => {
  const [{ value: boards }] = useField('boards');

  return <AnalyticsBoardForm boardId={boards.length > 0 ? boards[0] : ''} editing={editing} objName={venueName} />;
};

VenueAnalytics.propTypes = propTypes;
export default React.memo(VenueAnalytics);
