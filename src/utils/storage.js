'use strict';

import React, {
  AsyncStorage,
} from 'react-native';

export default {
  get: async (key) => {
    return AsyncStorage.getItem(key);
  },

  put: async (key, value) => {
    return AsyncStorage.setItem(key, value);
  },

  remove: async (key) => {
    return AsyncStorage.removeItem(key);
  }
}
