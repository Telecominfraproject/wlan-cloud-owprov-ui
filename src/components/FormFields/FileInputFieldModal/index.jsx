import React, { useCallback } from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
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
  canDelete: PropTypes.bool,
  wantBase64: PropTypes.bool,
};

const defaultProps = {
  test: () => true,
  isRequired: false,
  isDisabled: false,
  isHidden: false,
  definitionKey: null,
  canDelete: false,
  wantBase64: false,
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
  canDelete,
  wantBase64,
}) => {
  const [{ value }, { touched, error }, { setValue }] = useField(name);
  const [{ value: fileNameValue }, , { setValue: setFile }] = useField(fileName);

  const onDelete = useCallback(() => {
    setValue(undefined);
    setFile(undefined);
  }, []);
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
      canDelete={canDelete}
      onDelete={onDelete}
      wantBase64={wantBase64}
    />
  );
};

FileInputFieldModal.propTypes = propTypes;
FileInputFieldModal.defaultProps = defaultProps;

export default React.memo(FileInputFieldModal);
