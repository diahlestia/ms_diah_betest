import Log from "../models/log.model.js"

async function saveLog(log) {
  return new Log(log).save();
}

export { 
  saveLog 
};
