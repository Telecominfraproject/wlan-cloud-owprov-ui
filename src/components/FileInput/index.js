import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import Papa from 'papaparse';
import { v4 as uuid } from 'uuid';
import { CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { testMac } from 'constants/formTests';

const fileToString = async (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ({ target: { result = null } }) => resolve(result);
    reader.onerror = () => resolve(null);
  });

const transformHeader = (header) => header.replace(/"/g, '');

const propTypes = {
  setValue: PropTypes.func.isRequired,
  refreshId: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    commonNames: PropTypes.string,
  }),
};

const defaultProps = {
  errors: null,
};

const FileInput = ({ setValue, refreshId, errors }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [fileKey, setFileKey] = useState(uuid());

  const parseFile = async (file) => {
    setResult(null);

    const fileStr = await fileToString(file);

    if (fileStr === null) {
      setResult({
        error: true,
        msg: 'General error while parsing file',
      });
    } else {
      const csvConfig = {
        header: false,
        delimiter: ',',
        transformHeader,
        quoteChar: '"',
      };

      const parsedFile = Papa.parse(fileStr, csvConfig);

      if (parsedFile.errors.length > 0) {
        setResult({
          error: true,
          msg: t('batch.parsing_error', {
            row: parsedFile.errors[0].row,
            e: parsedFile.errors[0].message,
          }),
        });
      } else {
        let valid = true;

        try {
          const macArray = parsedFile.data.map((mac) => mac[0].trim());

          for (const [row, mac] of macArray.entries()) {
            if (!testMac(mac)) {
              valid = false;
              setResult({
                error: true,
                msg: t('batch.invalid_mac', {
                  row,
                  mac,
                }),
              });
              break;
            }
            const dupIndex = macArray.indexOf(mac);
            if (dupIndex >= 0 && dupIndex !== row) {
              valid = false;
              setResult({
                error: true,
                msg: t('batch.duplicate_in_file', {
                  firstRow: dupIndex,
                  secondRow: row,
                  mac,
                }),
              });
              break;
            }
          }

          if (valid) {
            setResult({
              error: false,
              msg: 'Success',
            });
            setValue('commonNames', macArray);
          }
        } catch {
          setResult({
            error: true,
            msg: t('batch.general_error_treating_file'),
          });
        }
      }
    }
  };

  const resetFile = () => {
    setResult(null);
    setValue('commonNames', []);
    setFileKey(uuid());
  };

  const changeFile = (e) => {
    if (e.target.files?.length > 0) parseFile(e.target.files[0]);
  };

  const resultDetails = () => {
    if (result?.error) {
      return <FormErrorMessage>{result.msg}</FormErrorMessage>;
    }
    if (errors?.commonNames) return <FormErrorMessage>{errors.commonNames}</FormErrorMessage>;

    return <FormHelperText>{t('certificates.common_names_explanation')}</FormHelperText>;
  };

  useEffect(() => {
    setFileKey(uuid());
  }, [refreshId]);

  return (
    <FormControl isInvalid={errors.commonNames || result?.error} isRequired>
      <FormLabel ms="4px" fontSize="md" fontWeight="normal">
        {t('certificates.device_macs')}
      </FormLabel>
      <InputGroup>
        <Input borderRadius="15px" pt={1} fontSize="sm" type="file" onChange={changeFile} key={fileKey} accept=".csv" />
        <InputRightElement hidden={!result}>
          {' '}
          <IconButton icon={<CloseIcon />} onClick={resetFile} />
        </InputRightElement>
      </InputGroup>
      {resultDetails()}
    </FormControl>
  );
};

FileInput.propTypes = propTypes;
FileInput.defaultProps = defaultProps;

export default FileInput;
