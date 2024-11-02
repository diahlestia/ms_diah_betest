import { 
  findUser, 
  findUserById, 
  findUserByAccountNumber,  
  findUserByIdentityNumber,
  findUserByEmailorUsername,
  updateUser,
  deleteUser,
  saveUser  
} from '../repositories/user.repository.js'

async function getUser() {
  return await findUser();
}

async function saveUserData(userData) {
  return await saveUser(userData);
}

async function getUserById(id) {
  return await findUserById(id);
}

async function getUserByAccountNumber(accountNumber) {
  return await findUserByAccountNumber(accountNumber);
}

async function getUserByIdentityNumber(identityNumber) {
  return await findUserByIdentityNumber(identityNumber);
}

async function getUserByEmailOrUsername(email, username) {
  return await findUserByEmailorUsername(email, username);
}

async function updateUserData(id, userData) {
  return await updateUser(id, userData);
}

async function deleteUserData(id) {
  return await deleteUser(id);
}

export { 
  getUser, 
  saveUserData,
  getUserById, 
  getUserByAccountNumber,  
  getUserByIdentityNumber,
  getUserByEmailOrUsername,
  updateUserData,
  deleteUserData
};
