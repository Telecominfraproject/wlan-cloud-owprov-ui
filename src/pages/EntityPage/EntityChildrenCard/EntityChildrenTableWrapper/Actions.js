import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { MagnifyingGlass } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const propTypes = {
  cell: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const Actions = ({ cell: { original: entity } }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToPage = () => navigate(`/entity/${entity.id}`);

  return (
    <Flex>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton ml={2} colorScheme="blue" icon={<MagnifyingGlass size={20} />} size="sm" onClick={handleGoToPage} />
      </Tooltip>
    </Flex>
  );
};

Actions.propTypes = propTypes;

export default Actions;
