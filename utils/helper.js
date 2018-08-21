let pub = {};

pub.containsBool = async (value) => {
  if(value === false || value === true){
    return true
  }
  return false;
}

module.exports = pub;
