import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowSquareOut } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const propTypes = {
  cell: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const Actions = ({ cell: { original: configuration } }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToPage = () => navigate(`/configuration/${configuration.id}`);

  return (
    <Flex>
      <Tooltip hasArrow label={t('venues.go_to_page')} placement="top">
        <IconButton ml={2} colorScheme="blue" icon={<ArrowSquareOut size={20} />} size="sm" onClick={handleGoToPage} />
      </Tooltip>
    </Flex>
  );
};

Actions.propTypes = propTypes;

export default Actions;
