import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useGetResource } from 'hooks/Network/Resources';
import { useTranslation } from 'react-i18next';
import { SimpleGrid, useToast } from '@chakra-ui/react';
import DisplayNumberField from 'components/DisplayFields/DisplayNumberField';

const propTypes = {
  variableBlockId: PropTypes.string.isRequired,
};

const LockedVlan = ({ variableBlockId }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: resource } = useGetResource({
    t,
    toast,
    id: variableBlockId,
    enabled: true,
  });

  const data = useMemo(() => {
    if (resource && resource.variables[0]) {
      return JSON.parse(resource.variables[0].value);
    }
    return null;
  }, [resource]);

  if (!data) return null;

  return (
    <SimpleGrid minChildWidth="300px" spacing="20px" mb={4}>
      <DisplayNumberField label="id" value={data.id} isRequired w={36} />
    </SimpleGrid>
  );
};

LockedVlan.propTypes = propTypes;
export default React.memo(LockedVlan);
