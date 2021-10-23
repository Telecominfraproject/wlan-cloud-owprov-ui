import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'ucentral-libs';
import ContactsTable from 'components/ContactsTable';
import AddContactModal from 'components/AddContactModal';

const ContactsPage = () => {
  const { t } = useTranslation();
  const [showAddModal, toggleShowAdd] = useToggle(false);
  const [refreshId, setRefreshId] = useState(0);

  const refreshTable = () => setRefreshId(refreshId + 1);

  return (
    <div>
      <ContactsTable
        title={t('contact.title')}
        entityPage={false}
        toggleAdd={toggleShowAdd}
        refreshId={refreshId}
        useUrl
        refreshPageTables={refreshTable}
      />
      <AddContactModal
        show={showAddModal}
        toggle={toggleShowAdd}
        refreshId={refreshId}
        refreshTable={refreshTable}
        entity={null}
      />
    </div>
  );
};

export default ContactsPage;
