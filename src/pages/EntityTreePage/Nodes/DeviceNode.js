import React from 'react';
import PropTypes from 'prop-types';
import { v4 as createUuid } from 'uuid';
import { CButtonToolbar } from '@coreui/react';
import { Dot } from 'ucentral-libs';
import { Handle } from 'react-flow-renderer';
import HeartShape from './HeartShape';

const getHeartColor = (sanity) => {
  if (sanity === 10) return 'text-success';
  if (sanity >= 90) return 'text-warning';
  if (sanity !== undefined) return 'text-danger';
  return 'text-dark';
};

const getConnectColor = (data) => {
  if (data.extraData.connectionInfo) {
    return data.extraData.connectionInfo.connected ? 'bg-success' : 'bg-danger';
  }
  return 'bg-dark';
};

const DeviceNode = ({ data, isConnectable }) => (
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
        <div className="mt-1 mr-1 align-middle">
          <Dot className={`${getConnectColor(data)} align-middle`} />
        </div>
        <div className="mt-1 mr-1 align-middle px-1">
          <HeartShape
            className={getHeartColor(
              data.extraData?.healthCheckInfo?.recorded > 0
                ? data.extraData.healthCheckInfo.sanity
                : undefined,
            )}
          />
        </div>
      </CButtonToolbar>
    </div>
  </>
);

DeviceNode.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  isConnectable: PropTypes.bool.isRequired,
};

export default React.memo(DeviceNode);
