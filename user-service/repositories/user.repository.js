import User from "../models/user.model.js"

async function findUser() {
  return User.find();
}

async function findUserById(id) {
  return User.findById(id);
}

async function findUserByAccountNumber(accountNumber) {
  return User.findOne({ accountNumber });
}

async function findUserByIdentityNumber(identityNumber) {
  return User.findOne({ identityNumber });
}

async function findUserByEmailorUsername(email, username) {  
  return User.findOne({ $or: [{emailAddress: email }, {userName: username}]});
}

async function saveUser(user) {
  return new User(user).save();
}

async function updateUser(user) {
  return User.findByIdAndUpdate(user._id, user, { new: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id)
}

export { 
  findUser, 
  findUserById, 
  findUserByAccountNumber,  
  findUserByIdentityNumber,
  findUserByEmailorUsername,
  updateUser,
  deleteUser,
  saveUser 
};
