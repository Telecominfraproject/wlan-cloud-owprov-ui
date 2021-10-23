import React from 'react';
import PropTypes from 'prop-types';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';

const RawJsonConfig = ({ orderedBlocks }) => (
  <CCard>
    <CCardHeader className="p-1">
      <div style={{ fontWeight: '600' }} className=" text-value-lg float-left">
        Resulting Raw JSON Configuration
      </div>
    </CCardHeader>
    <CCardBody>
      &#123;
      {Object.keys(orderedBlocks.unit).length > 0 ? (
        <pre className="pl-3">{JSON.stringify(orderedBlocks.unit, null, 2)},</pre>
      ) : null}
      {Object.keys(orderedBlocks.globals).length > 0 ? (
        <pre className="pl-3">{JSON.stringify(orderedBlocks.globals, null, 2)},</pre>
      ) : null}
      {Object.keys(orderedBlocks.metrics).length > 0 ? (
        <pre className="pl-3">{JSON.stringify(orderedBlocks.metrics, null, 2)},</pre>
      ) : null}
      {Object.keys(orderedBlocks.services).length > 0 ? (
        <pre className="pl-3">{JSON.stringify(orderedBlocks.services, null, 2)},</pre>
      ) : null}
      {Object.keys(orderedBlocks.radios).length > 0 ? (
        <pre className="pl-3">
          {JSON.stringify(
            Array.isArray(orderedBlocks.radios.radios)
              ? orderedBlocks.radios
              : orderedBlocks.radios.radios,
            null,
            2,
          )}
          ,
        </pre>
      ) : null}
      {Object.keys(orderedBlocks.interfaces).length > 0 ? (
        <pre className="pl-3">{JSON.stringify(orderedBlocks.interfaces, null, 2)},</pre>
      ) : null}
      &#125;
    </CCardBody>
  </CCard>
);

RawJsonConfig.propTypes = {
  orderedBlocks: PropTypes.instanceOf(Object).isRequired,
};

export default React.memo(RawJsonConfig);
