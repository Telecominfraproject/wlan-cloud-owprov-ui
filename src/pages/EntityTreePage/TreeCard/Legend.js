import React from 'react';
import { CCol, CRow } from '@coreui/react';

const Legend = () => (
  <>
    <div
      className="float-left p-1 ml-2 mt-2 border font-weight-bold"
      style={{
        width: '140px',
        position: 'absolute',
        backgroundColor: '#f5f6f7',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        borderRadius: '5px',
      }}
    >
      <CRow>
        <CCol sm="6">Root</CCol>
        <CCol>
          <div
            className="p-0"
            style={{
              backgroundColor: '#0F0A0A',
              color: 'white',
              height: '80%',
              width: '100%',
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Entity</CCol>
        <CCol className="pt-1">
          <div
            style={{
              backgroundColor: '#CCDAD1',
              height: '80%',
              width: '100%',
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Venue</CCol>
        <CCol className="pt-1">
          <div
            style={{
              height: '80%',
              backgroundColor: '#40798C',
              width: '100%',
            }}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="6">Device</CCol>
        <CCol className="pt-1">
          <div
            style={{
              height: '80%',
              backgroundColor: '#4B3B40',
              width: '100%',
            }}
          />
        </CCol>
      </CRow>
    </div>
  </>
);

export default Legend;
