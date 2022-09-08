import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const propTypes = {
  entityName: PropTypes.string,
  entityId: PropTypes.string,
};
const defaultProps = {
  entityName: '',
  entityId: '',
};

const EntityCell = ({ entityName, entityId }) => {
  const navigate = useNavigate();

  const goTo = () => navigate(`/entity/${entityId}`);

  if (entityName !== '' && entityId !== '') {
    return (
      <Button size="sm" variant="link" onClick={goTo}>
        {entityName}
      </Button>
    );
  }

  return null;
};

EntityCell.propTypes = propTypes;
EntityCell.defaultProps = defaultProps;
export default React.memo(EntityCell);
