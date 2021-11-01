import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CTextarea,
  CInvalidFeedback,
  CInputFile,
  CPopover,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { checkIfJson } from 'utils/helper';
import General from '../General';

const Interfaces = ({
  baseFields,
  updateBaseWithId,
  fields,
  setFields,
  setCanSave,
  deleteConfig,
  disabled,
}) => {
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
    if (fields.interfaces) {
      setNewInterfaces(JSON.stringify(fields, null, 2));
    }
  }, [fields]);

  return (
    <div className="px-3">
      <CRow className="py-2">
        <CCol>
          <h5 className="float-left pt-2">Interfaces</h5>
          <div className="float-right">
            <CPopover content={t('common.delete')}>
              <CButton
                color="primary"
                variant="outline"
                onClick={deleteConfig}
                className="ml-1"
                disabled={disabled}
              >
                <CIcon name="cil-trash" content={cilTrash} />
              </CButton>
            </CPopover>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <General fields={baseFields} updateWithId={updateBaseWithId} disabled={disabled} />
        </CCol>
      </CRow>
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
      <CInputFile
        id="file-input"
        name="file-input"
        accept=".json"
        onChange={(e) => handleJsonFile(e.target.files[0])}
        disabled={disabled}
      />
      <CRow className="my-4">
        <CCol>
          <CTextarea
            name="textarea-input"
            id="textarea-input"
            rows="9"
            placeholder="Interfaces JSON"
            value={newInterfaces}
            onChange={onChange}
            invalid={jsonError}
            disabled={disabled}
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
  baseFields: PropTypes.instanceOf(Object).isRequired,
  updateBaseWithId: PropTypes.func.isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  setFields: PropTypes.func.isRequired,
  setCanSave: PropTypes.func.isRequired,
  deleteConfig: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Interfaces;
