import { 
    saveLog  
  } from '../repositories/log.repository.js'
  
  async function saveLogData(logData) {
    return await saveLog(logData);
  }
  
export { 
    saveLogData,
}