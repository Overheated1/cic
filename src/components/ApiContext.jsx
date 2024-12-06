import React, { createContext } from 'react';

export const ApiContext = createContext({
  BASE_URL: 'http://localhost:',
  PORT : 5000
});
