import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import SaveButton from 'components/Buttons/SaveButton';
import { useUpdateMap } from 'hooks/Network/Maps';
import { useQueryClient } from 'react-query';

const propTypes = {
  mapId: PropTypes.string.isRequired,
  mapRef: PropTypes.instanceOf(Object).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  stopEditing: PropTypes.func.isRequired,
};

const SaveMapButton = ({ mapId, mapRef, isDisabled, stopEditing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const updateMap = useUpdateMap({ t, toast, mapId });
  const queryClient = useQueryClient();

  const handleClick = () => {
    const data = mapRef?.current ? JSON.stringify(mapRef.current.getDataToSave()) : '';
    updateMap.mutateAsync(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['get-maps']);
          toast({
            id: 'map-update-success',
            title: t('common.success'),
            description: t('crud.success_update_obj', {
              obj: t('map.title'),
            }),
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          stopEditing();
        },
      },
    );
  };

  return (
    <SaveButton
      onClick={handleClick}
      isDisabled={isDisabled || mapId === '' || !mapRef?.current}
      isLoading={updateMap.isLoading}
      isCompact
      ml={2}
    />
  );
};

SaveMapButton.propTypes = propTypes;

export default SaveMapButton;
