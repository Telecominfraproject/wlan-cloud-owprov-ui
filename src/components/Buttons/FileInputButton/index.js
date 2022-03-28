import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Input, InputGroup } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

const propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setFileName: PropTypes.func,
  refreshId: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  isStringFile: PropTypes.bool,
};
const defaultProps = {
  setFileName: () => {},
  isHidden: false,
  isStringFile: false,
};

const FileInputButton = ({ value, setValue, setFileName, refreshId, accept, isHidden, isStringFile }) => {
  const [fileKey, setFileKey] = useState(uuid());
  let fileReader;

  const handleStringFileRead = () => {
    const content = fileReader.result;
    if (content) {
      setValue(content);
    }
  };

  const changeFile = (e) => {
    const file = e.target.files[0];
    const newVal = URL.createObjectURL(file);
    if (!isStringFile) {
      setValue(newVal, file);
      setFileName(file.name ?? '');
    } else {
      fileReader = new FileReader();
      setFileName(file.name);
      fileReader.onloadend = handleStringFileRead;
      fileReader.readAsText(file);
    }
  };

  useEffect(() => {
    if (value === '') setFileKey(uuid());
  }, [refreshId, value]);

  return (
    <FormControl hidden={isHidden}>
      <InputGroup>
        <Input
          borderRadius="15px"
          pt={1}
          fontSize="sm"
          type="file"
          onChange={changeFile}
          key={fileKey}
          accept={accept}
        />
      </InputGroup>
    </FormControl>
  );
};

FileInputButton.propTypes = propTypes;
FileInputButton.defaultProps = defaultProps;

export default FileInputButton;
