const LILING = "liling";
const LILING_CODE = "supersecret";

var AccessCode = {
  checkInput: function(teacher, code) {
    if (teacher === LILING && code === LILING_CODE) {
      return true
    } else {
      return false
    }
  },

  checkLocalStorage: function(teacher) {
    if (teacher === LILING && localStorage.getItem("edusagaAccessKey") === LILING_CODE) {
      return true
    } else {
      return false
    }
  }
}

export default AccessCode;
