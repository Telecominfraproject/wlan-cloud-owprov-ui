import React from 'react';

export const worldStyle = {
  background: '#3399ff',
  color: 'white',
  border: '1px solid #777',
  width: 220,
  padding: 10,
};

export const entityStyle = {
  background: '#2eb85c',
  color: 'white',
  width: 220,
  padding: 15,
};

export const venueStyle = {
  background: '#e55353',
  color: 'white',
  width: 220,
  padding: 15,
};

export const node = (entity) => (
  <div className="align-middle">
    <h5 className="align-middle mb-0">{entity.name}</h5>
  </div>
);
