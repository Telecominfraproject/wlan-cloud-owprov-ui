import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetMaps } from 'hooks/Network/Maps';
import { useTranslation } from 'react-i18next';
import { Button, useToast } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useAuth } from 'contexts/AuthProvider';
import { FloppyDisk, X } from 'phosphor-react';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const propTypes = {
  isLoading: PropTypes.bool.isRequired,
  map: PropTypes.string.isRequired,
  setMap: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const MapPicker = ({ isLoading, map, setMap, isDisabled }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    user: { id },
    getPref,
    deletePref,
    setPref,
  } = useAuth();
  const [prefMap, setPrefMap] = useState(getPref('provisioning.defaultNetworkMap'));

  const { data: maps, isFetching } = useGetMaps({ t, toast });

  const getMaps = useCallback(() => {
    if (maps) {
      return [
        { label: t('map.auto_map'), value: '' },
        {
          label: t('map.my_maps'),
          options: maps.filter((m) => m.creator === id).map((m) => ({ value: m.id, label: m.name })),
        },
        {
          label: t('map.by_others'),
          options: maps.filter((m) => m.creator !== id).map((m) => ({ value: m.id, label: m.name })),
        },
      ];
    }
    return [{ label: t('map.auto_map'), value: '' }];
  }, [maps, map]);

  const onChange = ({ value }) => {
    setMap(value);
  };

  const defaultClick = () => {
    if (prefMap === map) {
      deletePref('provisioning.defaultNetworkMap');
      setPrefMap(null);
    } else {
      setPref({ preference: 'provisioning.defaultNetworkMap', value: map });
      setPrefMap(map);
    }
  };

  useEffect(() => {
    if (maps && map === '') {
      if (!maps.find((m) => m.id === prefMap)) {
        setMap('');
      } else {
        setMap(prefMap);
      }
    }
  }, [maps]);

  return (
    <>
      <Button
        colorScheme={prefMap === map ? 'gray' : 'blue'}
        onClick={defaultClick}
        rightIcon={prefMap === map ? <X size={20} /> : <FloppyDisk size={20} />}
        mr={2}
        isDisabled={isLoading || isDisabled}
      >
        {map === prefMap ? t('map.default_map') : t('map.set_as_default')}
      </Button>
      <Select
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: '260px',
          }),
          menuPortal: (provided) => ({ ...provided, zIndex: 1000 }),
          menu: (provided) => ({ ...provided, zIndex: 1000 }),
        }}
        name="TreeMaps"
        options={getMaps()}
        onChange={onChange}
        value={{
          value: map,
          label: map === '' || !maps ? t('map.auto_map') : maps.find((m) => m.id === map)?.name,
        }}
        formatGroupLabel={formatGroupLabel}
        isDisabled={isFetching || !maps || isLoading || isDisabled}
      />
    </>
  );
};

MapPicker.propTypes = propTypes;
export default React.memo(MapPicker);
