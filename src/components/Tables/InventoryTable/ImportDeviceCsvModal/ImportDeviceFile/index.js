import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Center, Heading, Input } from '@chakra-ui/react';
import { usePapaParse } from 'react-papaparse';

const transformHeader = (header) => header.replace(/"/g, '');

const fileToString = async (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ({ target: { result = null } }) => resolve(result);
    reader.onerror = () => resolve(null);
  });

const propTypes = {
  setPhase: PropTypes.func.isRequired,
  setDevices: PropTypes.func.isRequired,
  setIsCloseable: PropTypes.func.isRequired,
  refreshId: PropTypes.string.isRequired,
};

const ImportDeviceFile = ({ setPhase, setDevices, setIsCloseable, refreshId }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const { readString } = usePapaParse();

  const parseFile = async (file) => {
    setResult({ isLoading: true });

    const fileStr = await fileToString(file);

    if (fileStr === null) {
      setResult({ error: 'General error while parsing file' });
    } else {
      const csvConfig = {
        header: true,
        transformHeader,
        skipEmptyLines: true,
        quoteChar: '"',
      };
      const data = readString(fileStr, csvConfig);

      if (data.errors.length > 0) {
        setResult({ error: `Error on row ${data.errors[0].row}: ${data.errors[0].message}` });
      } else {
        setResult({ deviceList: data.data });
      }
    }
  };

  const onChange = (e) => {
    setIsCloseable(false);
    if (e.target.files?.length > 0) parseFile(e.target.files[0]);
  };

  const goToNext = () => {
    setDevices(result.deviceList);
    setPhase(1);
  };

  return (
    <>
      <Heading size="sm">{t('devices.import_explanation')}</Heading>
      <Alert mt={2} status="warning">
        {t('devices.import_device_warning')}
      </Alert>
      <Input
        borderRadius="15px"
        my={4}
        pt={1}
        maxW="280px"
        fontSize="sm"
        type="file"
        onChange={onChange}
        isInvalid={result?.error}
        key={refreshId}
        accept=".csv"
      />
      {result?.error && <Alert colorScheme="red">{result.error}</Alert>}
      <Center>
        <Button mb={4} isDisabled={!result?.deviceList} onClick={goToNext}>
          {t('devices.test_batch')}
        </Button>
      </Center>
    </>
  );
};

ImportDeviceFile.propTypes = propTypes;
export default ImportDeviceFile;
