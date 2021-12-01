import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CButton, CPopover } from '@coreui/react';
import { cilX, cilSave } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Modal, useFormFields } from 'ucentral-libs';
import Form from './Form';

const initialForm = {
  name: {
    value: '',
    error: false,
    required: true,
  },
  description: {
    value: '',
    error: false,
  },
  note: {
    value: '',
    error: false,
  },
  visibility: {
    value: 'public',
    error: false,
  },
};

const DuplicateModal = ({ show, toggle, treeInfo, nodeInfo, duplicateMap }) => {
  const { t } = useTranslation();
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields({ ...initialForm });

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (field.required && field.value === '') {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }

    return success;
  };

  const save = () => {
    if (validation()) {
      duplicateMap(
        {
          name: fields.name.value,
          description: fields.description.value,
          notes: fields.note.value.length > 0 ? [{ note: fields.note.value }] : undefined,
          visibility: fields.visibility.value,
        },
        nodeInfo,
      );
    }
  };

  useEffect(() => {
    if (show) setFormFields({ ...initialForm });
  }, [show]);

  return (
    <Modal
      size="lg"
      show={show}
      toggle={toggle}
      title={
        nodeInfo
          ? t('entity.duplicate_with_node', {
              mapName: treeInfo.name,
              rootName: nodeInfo.name,
            })
          : t('entity.duplicate_map')
      }
      headerButtons={
        <>
          <CPopover content={t('common.add')}>
            <CButton color="primary" variant="outline" onClick={save}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </>
      }
    >
      <Form t={t} fields={fields} updateField={updateFieldWithId} />
    </Modal>
  );
};

DuplicateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  treeInfo: PropTypes.instanceOf(Object).isRequired,
  nodeInfo: PropTypes.instanceOf(Object),
  duplicateMap: PropTypes.func.isRequired,
};

DuplicateModal.defaultProps = {
  nodeInfo: null,
};

export default DuplicateModal;
