const findPerson = (users, id) => {
  return users.find(user => user.id === id) || "unknown";
}

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export {
  findPerson,
  capitalize
}