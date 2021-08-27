import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AddInventoryTagForm, useAuth, useEntity, useFormFields, useToast } from 'ucentral-libs';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CNav,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
} from '@coreui/react';
import InventoryTable from 'components/InventoryTable';
import axiosInstance from 'utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const initialForm = {
  entity: {
    value: '',
    error: false,
    hidden: false,
  },
  serialNumber: {
    value: '',
    error: false,
    required: true,
    regex: '^[a-fA-F0-9]+$',
    length: 12,
  },
  name: {
    value: '',
    error: false,
    required: true,
  },
  deviceType: {
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
};

const AddInventoryTagModal = ({ entity, show, toggle, refreshTable, refreshId }) => {
  const { t } = useTranslation();
  const { deviceTypes } = useEntity();
  const { endpoints, currentToken } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [fields, updateFieldWithId, updateField, setFormFields] = useFormFields(initialForm);
  const [loading, setLoading] = useState(false);

  const validation = () => {
    let success = true;

    for (const [key, field] of Object.entries(fields)) {
      if (
        (field.required && field.value === '') ||
        (field.length && field.value.length !== field.length)
      ) {
        updateField(key, { error: true });
        success = false;
        break;
      }
    }
    return success;
  };

  const addInventoryTag = () => {
    if (validation()) {
      setLoading(true);
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      const parameters = {
        entity: entity?.uuid ?? undefined,
        serialNumber: fields.serialNumber.value,
        name: fields.name.value,
        deviceType: fields.deviceType.value,
        description:
          fields.description.value.trim() !== '' ? fields.description.value.trim() : undefined,
        notes: fields.note.value !== '' ? [{ note: fields.note.value }] : undefined,
      };

      axiosInstance
        .post(
          `${endpoints.owprov}/api/v1/inventory/${fields.serialNumber.value}`,
          parameters,
          options,
        )
        .then(() => {
          addToast({
            title: t('common.success'),
            body: t('inventory.tag_created'),
            color: 'success',
            autohide: true,
          });
          refreshTable();
        })
        .catch(() => {
          addToast({
            title: t('common.error'),
            body: t('inventory.tag_creation_error'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (show) {
      setActiveTab(0);
      refreshTable();
      const startingForm = initialForm;

      // If this modal is used within an Entity Page, we use the page's entity and hide the field
      if (entity) {
        startingForm.entity.value = entity.uuid;
        startingForm.entity.hidden = true;
      }

      setFormFields(startingForm);
    }
  }, [show]);

  return (
    <CModal className="text-dark" size="xl" show={show} onClose={toggle}>
      <CModalHeader>
        <CModalTitle>{t('inventory.add_tag_to', { name: entity?.name })}</CModalTitle>
      </CModalHeader>
      <CModalBody className="pb-5">
        <CNav variant="tabs">
          <CNavLink href="#" active={activeTab === 0} onClick={() => setActiveTab(0)}>
            Create New
          </CNavLink>
          <CNavLink href="#" active={activeTab === 1} onClick={() => setActiveTab(1)}>
            Unassigned Inventory
          </CNavLink>
        </CNav>
        <CTabContent className="py-2">
          <CTabPane active={activeTab === 0}>
            <AddInventoryTagForm
              t={t}
              disable={loading}
              fields={fields}
              updateField={updateFieldWithId}
              deviceTypes={deviceTypes}
            />
          </CTabPane>
          <CTabPane active={activeTab === 1}>
            <InventoryTable
              entity={entity}
              refreshId={refreshId}
              refreshPageTables={refreshTable}
              urlId="unassigned"
              title={t('inventory.unassigned_tags')}
            />
          </CTabPane>
        </CTabContent>
      </CModalBody>
      {activeTab === 0 ? (
        <CModalFooter>
          <CButton disabled={loading} color="primary" onClick={addInventoryTag}>
            {t('common.add')}
          </CButton>
          <CButton color="secondary" onClick={toggle}>
            {t('common.close')}
          </CButton>
        </CModalFooter>
      ) : (
        <div />
      )}
    </CModal>
  );
};

AddInventoryTagModal.propTypes = {
  entity: PropTypes.instanceOf(Object).isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refreshTable: PropTypes.func,
  refreshId: PropTypes.number.isRequired,
};

AddInventoryTagModal.defaultProps = {
  refreshTable: null,
};

export default AddInventoryTagModal;