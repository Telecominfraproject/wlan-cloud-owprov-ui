import React from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { CButtonToolbar } from '@coreui/react';
import { cilPeople, cilRouter, cilWifiSignal4 } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Handle } from 'react-flow-renderer';
import { numberToCompact } from 'ucentral-libs';

const getRrmClass = (rrm) => {
  switch (rrm) {
    case 'on':
      return 'text-success';
    case 'off':
      return 'text-danger';
    default:
      return 'text-warning';
  }
};

const EntityNode = ({ data, isConnectable }) => {
  if (data?.extraData?.id === '0000-0000-0000') {
    return (
      <>
        <Handle
          type="target"
          position="top"
          style={{ background: '#555' }}
          isConnectable={isConnectable}
        />
        <div className="align-middle text-center">
          <h5 className="align-middle font-weight-bold mb-0">{data.entityName}</h5>
        </div>
        <Handle
          type="source"
          position="bottom"
          id="a"
          style={{ background: '#555' }}
          isConnectable={isConnectable}
        />
      </>
    );
  }

  return (
    <>
      <Handle
        type="target"
        position="top"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      <div className="align-middle" data-tip data-for={data.tooltipId} id={createUuid()}>
        <h5 className="align-middle font-weight-bold mb-0 text-center">{data.entityName}</h5>
        <CButtonToolbar role="group" className="justify-content-center" style={{ width: '180px' }}>
          <div className="mt-1 mr-1">
            <CIcon content={cilRouter} />{' '}
          </div>
          <div className="mt-1 mr-2 font-weight-bold">
            {numberToCompact(data.extraData.devices.length, 2)}
          </div>
          <div className="mt-1 mr-2">
            <CIcon className={getRrmClass(data.extraData.rrm)} content={cilWifiSignal4} />
          </div>
          <div className="mt-1 mr-1">
            <CIcon content={cilPeople} />
          </div>
          <div className="mt-1 font-weight-bold">{data.extraData.contacts?.length ?? ''}</div>
        </CButtonToolbar>
      </div>
      {data.extraData.children.length > 0 ||
      data.extraData.venues.length > 0 ||
      data.extraData.devices.length > 0 ? (
        <Handle
          type="source"
          position="bottom"
          id="a"
          style={{ background: '#555' }}
          isConnectable={isConnectable}
        />
      ) : null}
    </>
  );
};
EntityNode.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  isConnectable: PropTypes.bool.isRequired,
};

export default React.memo(EntityNode);
