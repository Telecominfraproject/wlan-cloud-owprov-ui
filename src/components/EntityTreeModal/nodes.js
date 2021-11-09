import React from 'react';

export const worldStyle = {
  background: '#0F0A0A',
  color: 'white',
  border: '1px solid #777',
  width: 250,
  padding: 20,
};

export const entityStyle = {
  background: '#2292A4',
  color: 'white',
  width: 250,
  padding: 15,
};

export const venueStyle = {
  background: '#F5EFED',
  color: 'black',
  width: 250,
  padding: 10,
};

export const node = (entity) => (
  <div className="align-middle">
    <h3 className="align-middle mb-0 font-weight-bold">{entity.name}</h3>
  </div>
);
