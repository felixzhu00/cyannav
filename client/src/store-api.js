import axios from 'axios';

axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

const handleResponse = (response) => {
  return {
    status: response.status,
    data: response.data,
  };
};

const handleError = (error) => {
  if (error.response) {
    // The request was made, but the server responded with a status code outside of the range 2xx
    return {
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made, but no response was received
    return {
      status: 500,
      data: 'Server not reachable',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 500,
      data: 'Unknown error occurred',
    };
  }
};

// Map-related functions
export const getMapById = (id) => api.get(`/api/map${id}`).then(handleResponse).catch(handleError);
export const getUserMaps = (userId) => api.get(`/api/user${userId}`).then(handleResponse).catch(handleError);
export const getAllMaps = () => api.get('/api/allmap').then(handleResponse).catch(handleError);
export const getMapJsonbyId = (id) => api.get(`/api/mapjson${id}`).then(handleResponse).catch(handleError);
export const createNewMap = (type, template, json) => api.post('/api/newmap', { type, template, json }).then(handleResponse).catch(handleError);
export const createDuplicateMapById = (id) => api.post('/api/duplicatemap', { id }).then(handleResponse).catch(handleError);
export const createForkMapById = (id) => api.post('/api/forkmap', { id }).then(handleResponse).catch(handleError);
export const deleteMapById = (id) => api.delete(`/map/${id}`).then(handleResponse).catch(handleError);
export const updateMapNamebyId = (id, name) => api.put(`/mapname/${id}`, { name }).then(handleResponse).catch(handleError);
export const updateMapTag = (id, tag) => api.put(`/maptag/${id}`, { tag }).then(handleResponse).catch(handleError);
export const updateMapPublishStatus = (id, status) => api.put(`/mapstatus/${id}`, { status }).then(handleResponse).catch(handleError);
export const updateMapJson = (id, json) => api.put(`/mapjson/${id}`, { json }).then(handleResponse).catch(handleError);

// Auth-related functions
export const getLoggedIn = () => {
    return api.get('/auth/loggedIn')
      .then((response) => {
        // Log the successful response
        console.log('Response:', response);
        return handleResponse(response);
      })
      .catch((error) => {
        // Log the error
        console.error('Error:', error);
        return handleError(error);
      });
  };
export const loginUser = (email, password) => api.post('/auth/login', { email, password }).then(handleResponse).catch(handleError);
export const logoutUser = () => api.post('/auth/logout').then(handleResponse).catch(handleError);
export const registerUser = (email, username, password, passwordVerify) =>
  api.post('/auth/register', { email, username, password, passwordVerify }).then(handleResponse).catch(handleError);
export const requestReset = (email) => api.post('/auth/reset', { email }).then(handleResponse).catch(handleError);
export const updatePasscode = (email, password, passwordVerify, verificationCode) =>
  api.post('/auth/updatePass', { email, password, passwordVerify, verificationCode }).then(handleResponse).catch(handleError);
export const verifyCode = (code) => api.post('/auth/verifyCode', { code }).then(handleResponse).catch(handleError);
export const updateUsername = (loginToken, newUsername) =>
  api.post('/auth/updateUsername', { loginToken, newUsername }).then(handleResponse).catch(handleError);
export const updateEmail = (loginToken, newEmail) =>
  api.post('/auth/updateEmail', { loginToken, newEmail }).then(handleResponse).catch(handleError);
export const deleteAccount = (loginToken) => api.post('/auth/deleteAccount', { loginToken }).then(handleResponse).catch(handleError);

const apis = {
  getMapById,
  getUserMaps,
  getAllMaps,
  getMapJsonbyId,
  createNewMap,
  createDuplicateMapById,
  createForkMapById,
  deleteMapById,
  updateMapNamebyId,
  updateMapTag,
  updateMapPublishStatus,
  updateMapJson,
  getLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  requestReset,
  updatePasscode,
  verifyCode,
  updateUsername,
  updateEmail,
  deleteAccount,
};

export default apis;