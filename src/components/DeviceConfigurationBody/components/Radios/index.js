import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CTextarea, CInvalidFeedback, CInputFile } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { checkIfJson } from 'utils/helper';

const Radios = ({ creating, fields, setFields, setCanSave }) => {
  const { t } = useTranslation();
  const [newRadios, setNewRadios] = useState('');
  const [jsonError, setJsonError] = useState(false);
  let fileReader;

  const testCompatibility = (content) => {
    try {
      const obj = JSON.parse(content);

      if (obj.radios === undefined || !Array.isArray(obj.radios)) return false;
      return true;
    } catch {
      return false;
    }
  };
  const onChange = (e) => {
    setNewRadios(e.target.value);
  };

  const handleJsonRead = () => {
    setJsonError(false);
    const content = fileReader.result;
    if (checkIfJson(content)) {
      setNewRadios(content);
    } else {
      setJsonError(true);
    }
  };

  const handleJsonFile = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleJsonRead;
    fileReader.readAsText(file);
  };

  useEffect(() => {
    if (!testCompatibility(newRadios)) {
      setCanSave(false);
      setJsonError(true);
    } else {
      setCanSave(true);
      setJsonError(false);
      setFields(JSON.parse(newRadios));
    }
  }, [newRadios]);

  useEffect(() => {
    if (!creating && fields.radios) {
      setNewRadios(JSON.stringify(fields, null, '\t'));
    }
  }, [fields, creating]);

  return (
    <div>
      <CRow>
        <CCol sm="6">
          <h5>Radios Section</h5>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div>
            Please choose a valid JSON file containing the radios section. The JSON document should
            have the key &quot;radios&quot; at its root with an array as its value. (Example: &#123;
            &quot;radios&quot;: [...] &#125;)
          </div>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol lg="4" xxl="3">
          {t('configure.choose_file')}
        </CCol>
        <CCol>
          <CInputFile
            id="file-input"
            name="file-input"
            accept=".json"
            onChange={(e) => handleJsonFile(e.target.files[0])}
          />
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol>
          <CTextarea
            name="textarea-input"
            id="textarea-input"
            rows="9"
            placeholder="Radios JSON"
            value={newRadios}
            onChange={onChange}
            invalid={jsonError}
          />
          <CInvalidFeedback className="help-block">
            {t('configure.valid_json')}. The JSON document should have the key &quot;radios&quot; at
            its root with an array as its value. (Example: &#123; &quot;radios&quot;: [...] &#125;)
          </CInvalidFeedback>
        </CCol>
      </CRow>
    </div>
  );
};
Radios.propTypes = {
  creating: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  setFields: PropTypes.func.isRequired,
  setCanSave: PropTypes.func.isRequired,
};

export default Radios;
