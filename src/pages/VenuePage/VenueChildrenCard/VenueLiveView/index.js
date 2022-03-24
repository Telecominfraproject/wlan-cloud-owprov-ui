import React from 'react';
import PropTypes from 'prop-types';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, Spacer, Spinner, useToast } from '@chakra-ui/react';
import LoadingOverlay from 'components/LoadingOverlay';
import RefreshButton from 'components/Buttons/RefreshButton';
import CirclePack from './CirclePack';

const propTypes = {
  boardId: PropTypes.string.isRequired,
};

const VenueLiveView = ({ boardId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: timepoints, isFetching, refetch } = useGetAnalyticsBoardTimepoints({ t, toast, id: boardId });

  return !timepoints ? (
    <Center mt={6}>
      <Spinner size="xl" />
    </Center>
  ) : (
    <LoadingOverlay isLoading={isFetching}>
      <Box>
        <Flex mb={2}>
          <Spacer />
          <RefreshButton onClick={refetch} isLoading={isFetching} ml={2} />
        </Flex>
        {timepoints && <CirclePack timepoints={timepoints} />}
      </Box>
    </LoadingOverlay>
  );
};

VenueLiveView.propTypes = propTypes;
export default VenueLiveView;
