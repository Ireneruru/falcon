/// <reference path="../interfaces.d.ts" />

import * as uuid from 'node-uuid';
import * as d3 from 'd3';
import BrushableBar from './viz/brushable-bar';
import connection from './ws';

const vizs: any = {};

const formatQuery = (dims) => {
  const q: Request = {
    id: uuid.v4(),
    type: 'query',
    dims: dims
  };

  return q;
};

connection.onOpen(() => {
  const q1: Request = {
    id: uuid.v4(),
    type: 'range',
    dims: ['ARR_DELAY', 'DISTANCE'],
  };

  connection.send(q1, (result: any) => {
    const dims: any = {};
    Object.keys(result.ranges).forEach((dim) => {
      dims[dim] = {
        domain: result.ranges[dim],
        numBins: 10
      }
    });

    const handleUpdate = (dimension, domain) => {
      console.log('user brushed ' + dimension + ' to ' + domain);
      connection.send(formatQuery({ /* TODO - fill me in */}), (reult: any) => {
        console.log(dimension + ': ' + result);
      });
    };

    // We've retrieved the ranges, now get the initial data...
    connection.send(formatQuery(dims), (result: any) => {
      let selector;
      switch(result.dim) {
        case 'ARR_DELAY':
          selector = '#arr-delay';
          break;
        case 'DISTANCE':
          selector = '#distance';
          break;
      }

      vizs[result.dim] = new BrushableBar(selector, Object.assign({}, dims[result.dim], {
        y: result.data
      })).on('brushed', (domain) => {
        handleUpdate(result.dim, domain);
      });
    });
  });

});