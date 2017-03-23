var checkAccessCode = function(teacher, code) {
  if (teacher === "liling" && code === "supersecret") {
    return true
  } else {
    return false
  }
}

export default checkAccessCode;
