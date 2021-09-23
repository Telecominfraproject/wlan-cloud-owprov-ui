import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CRow, CCol, CTextarea, CInvalidFeedback, CInputFile } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { checkIfJson } from 'utils/helper';

const Interfaces = ({ creating, fields, setFields, setCanSave }) => {
  const { t } = useTranslation();
  const [newInterfaces, setNewInterfaces] = useState('');
  const [jsonError, setJsonError] = useState(false);
  let fileReader;

  const testCompatibility = (content) => {
    try {
      const obj = JSON.parse(content);

      if (obj.interfaces === undefined || !Array.isArray(obj.interfaces)) return false;
      return true;
    } catch {
      return false;
    }
  };
  const onChange = (e) => {
    setNewInterfaces(e.target.value);
  };

  const handleJsonRead = () => {
    setJsonError(false);
    const content = fileReader.result;
    if (checkIfJson(content)) {
      setNewInterfaces(content);
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
    if (!testCompatibility(newInterfaces)) {
      setCanSave(false);
      setJsonError(true);
    } else {
      setCanSave(true);
      setJsonError(false);
      setFields(JSON.parse(newInterfaces));
    }
  }, [newInterfaces]);

  useEffect(() => {
    if (!creating && fields.interfaces) {
      setNewInterfaces(JSON.stringify(fields, null, '\t'));
    }
  }, [fields, creating]);

  return (
    <div>
      <CRow>
        <CCol sm="6">
          <h5>Interfaces Section</h5>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div>
            Please choose a valid JSON file containing the interfaces section. The JSON document
            should have the key &quot;interfaces&quot; at its root with an array as its value.
            (Example: &#123; &quot;interfaces&quot;: [...] &#125;)
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
            placeholder="Interfaces JSON"
            value={newInterfaces}
            onChange={onChange}
            invalid={jsonError}
          />
          <CInvalidFeedback className="help-block">
            {t('configure.valid_json')}. The JSON document should have the key
            &quot;interfaces&quot; at its root with an array as its value. (Example: &#123;
            &quot;interfaces&quot;: [...] &#125;)
          </CInvalidFeedback>
        </CCol>
      </CRow>
    </div>
  );
};
Interfaces.propTypes = {
  creating: PropTypes.bool.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  setFields: PropTypes.func.isRequired,
  setCanSave: PropTypes.func.isRequired,
};

export default Interfaces;
