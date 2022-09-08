import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Card from 'components/Card';
import { Box, Flex, Heading, useBoolean, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDeleteMap, useGetMaps } from 'hooks/Network/Maps';
import ToggleEditButton from 'components/Buttons/ToggleEditButton';
import RefreshButton from 'components/Buttons/RefreshButton';
import { useQueryClient } from 'react-query';
import MapPicker from './MapPicker';
import Map from './Map';
import AutoAlignButton from './AutoAlignButton';
import DeleteMapButton from './DeleteMapButton';
import CreateMapButton from './CreateMapButton';
import SaveMapButton from './SaveMapButton';

const propTypes = {
  data: PropTypes.shape({
    tree: PropTypes.instanceOf(Object).isRequired,
    flatTree: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
    entities: PropTypes.instanceOf(Object).isRequired,
    venues: PropTypes.instanceOf(Object).isRequired,
    tags: PropTypes.instanceOf(Object).isRequired,
    devices: PropTypes.instanceOf(Object).isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  refreshData: PropTypes.func.isRequired,
};

const defaultProps = {
  data: null,
};

const MapDisplayCard = ({ data, isLoading, refreshData }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [mapId, setMapId] = useState('');
  const mapRef = useRef();
  const [isEditing, { off, toggle }] = useBoolean(false);
  const { data: maps, isFetching } = useGetMaps({ t, toast });
  const queryClient = useQueryClient();
  const deleteMapAsync = useDeleteMap({ t, toast, goToMap: () => setMapId('') });

  const toggleEditing = () => toggle();

  const deleteMap = useCallback(() => {
    deleteMapAsync.mutateAsync(mapId, {
      onSuccess: () => {
        queryClient.invalidateQueries(['get-maps']);
      },
    });
  }, [mapId]);

  return (
    <Card>
      <CardHeader mb="10px">
        <Box>
          <Heading size="md">{t('map.title')}</Heading>
        </Box>
        <Flex w="100%" flexDirection="row" alignItems="center">
          <Box ms="auto" display="flex">
            <MapPicker map={mapId} setMap={setMapId} isLoading={isLoading} isDisabled={isEditing} />
            <CreateMapButton
              isDuplicating={mapId !== ''}
              isDisabled={isEditing || isLoading}
              setMapId={setMapId}
              mapRef={mapRef}
            />
            <SaveMapButton
              mapId={mapId}
              mapRef={mapRef}
              stopEditing={off}
              isDisabled={isLoading || !isEditing || mapId === ''}
            />
            <ToggleEditButton
              toggleEdit={toggleEditing}
              isEditing={isEditing}
              isDisabled={isLoading || mapId === ''}
              isCompact
              ml={2}
            />
            <RefreshButton onClick={refreshData} isDisabled={isEditing} isFetching={isLoading} isCompact ml={2} />
            <AutoAlignButton onClick={mapRef?.current?.autoAlign} isDisabled={!isEditing} ml={2} />
            <DeleteMapButton deleteMap={deleteMap} isDisabled={isEditing || isLoading || mapId === ''} ml={2} />
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Box>
          {data && maps && !isFetching && (
            <Map
              data={data}
              selectedMap={maps.find((map) => map.id === mapId) ?? null}
              isEditing={isEditing}
              ref={mapRef}
            />
          )}
        </Box>
      </CardBody>
    </Card>
  );
};

MapDisplayCard.propTypes = propTypes;
MapDisplayCard.defaultProps = defaultProps;

export default MapDisplayCard;
