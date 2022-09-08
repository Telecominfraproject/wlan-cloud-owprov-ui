import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import FileInputModal from './FileInputModal';

const propTypes = {
  name: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  explanation: PropTypes.string.isRequired,
  test: PropTypes.func,
  label: PropTypes.string.isRequired,
  acceptedFileTypes: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isHidden: PropTypes.bool,
  definitionKey: PropTypes.string,
};

const defaultProps = {
  test: () => true,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  definitionKey: null,
};

const FileInputFieldModal = ({
  name,
  fileName,
  explanation,
  test,
  acceptedFileTypes,
  isDisabled,
  label,
  isRequired,
  isHidden,
  definitionKey,
}) => {
  const [{ value }, { touched, error }, { setValue }] = useField(name);
  const [{ value: fileNameValue }, , { setValue: setFile }] = useField(fileName);

  const onChange = useCallback((newValue, newFilename) => {
    setValue(newValue);
    setFile(newFilename);
  }, []);

  return (
    <FileInputModal
      value={value}
      fileNameValue={fileNameValue}
      label={label}
      acceptedFileTypes={acceptedFileTypes}
      explanation={explanation}
      onChange={onChange}
      test={test}
      error={error}
      touched={touched}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isHidden={isHidden}
      definitionKey={definitionKey}
    />
  );
};

FileInputFieldModal.propTypes = propTypes;
FileInputFieldModal.defaultProps = defaultProps;

export default React.memo(FileInputFieldModal);
