const c_users = [];

const join_User=(id, username, room)=> {
  const p_user = { id, username, room 
};

  c_users.push(p_user);
  console.log(c_users, "users");

  return p_user;
}

console.log("user out", c_users);

const get_Current_User=id =>
   c_users.find((p_user) => p_user.id === id);


const user_Disconnect=id=> {
  const index = c_users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Current_User,
  user_Disconnect,
};