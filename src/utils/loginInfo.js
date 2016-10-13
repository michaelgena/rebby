'use strict';

import storage from './storage';

const USERNAME_KEY = 'username_key';
const PASSWORD_KEY = 'password_key';
const SERVER_URL_KEY = 'server_url_key';

export default {

  canLogin: async () => {
    try {
      const username = await storage.get(USERNAME_KEY);
      const password = await storage.get(PASSWORD_KEY);
      const serverURL = await storage.get(SERVER_URL_KEY);
      if (username && password && serverURL) {
        return true;
      }
      return false;
    } catch(e) {
      throw e;
    }
  },

  getLoginInfo: async () => {
    try {
      const username = await storage.get(USERNAME_KEY);
      const password = await storage.get(PASSWORD_KEY);
      const serverURL = await storage.get(SERVER_URL_KEY);
      return {
        username,
        password,
        serverURL,
      };
    } catch(e) {
      throw e;
    }
  },

  storeLoginInfo: async (username, password, serverURL) => {
    try {
      await storage.put(USERNAME_KEY, username);
      await storage.put(PASSWORD_KEY, password);
      await storage.put(SERVER_URL_KEY, serverURL);
    } catch(e) {
      throw e;
    }
  },

  removeLoginInfo: async () => {
    try {
      await storage.remove(USERNAME_KEY);
      await storage.remove(PASSWORD_KEY);
      await storage.remove(SERVER_URL_KEY);
    } catch(e) {
      throw e;
    }
  }
}
