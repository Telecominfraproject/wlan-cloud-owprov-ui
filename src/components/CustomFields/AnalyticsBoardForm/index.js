import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Center, SimpleGrid } from '@chakra-ui/react';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import NumberField from 'components/FormFields/NumberField';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import DeleteButton from 'components/Buttons/DeleteButton';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  objName: PropTypes.string.isRequired,
};

const AnalyticsBoardForm = ({ editing, objName }) => {
  const { t } = useTranslation();
  const [{ value: board }, , { setValue: setBoard }] = useField('__BOARD');

  const handleCreate = () => {
    setBoard({
      name: objName,
      interval: 60,
      retention: 3600 * 24 * 7,
      monitorSubVenues: true,
    });
  };
  const handleDelete = () => setBoard(null);

  if (!board) {
    return (
      <Center my={8}>
        <Button colorScheme="blue" onClick={handleCreate} isDisabled={!editing}>
          {t('analytics.create_board')}
        </Button>
      </Center>
    );
  }

  return (
    <>
      <Box textAlign="right">
        <DeleteButton isDisabled={!editing} onClick={handleDelete} label={t('analytics.stop_monitoring')} />
      </Box>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <StringField name="__BOARD.name" label={t('common.name')} isDisabled={!editing} isRequired />
        <NumberField
          name="__BOARD.interval"
          label={t('analytics.interval')}
          isDisabled={!editing}
          isRequired
          unit={t('common.seconds')}
        />
        <NumberField
          name="__BOARD.retention"
          label={t('analytics.retention')}
          isDisabled={!editing}
          isRequired
          unit={t('common.days')}
          conversionFactor={3600 * 24}
        />
        <ToggleField name="__BOARD.monitorSubVenues" label={t('analytics.analyze_sub_venues')} isDisabled={!editing} />
      </SimpleGrid>
    </>
  );
};

AnalyticsBoardForm.propTypes = propTypes;

export default React.memo(AnalyticsBoardForm);
