const URL_PREFIX = "http://localhost:3002";

const API = {
  getAllData: () => {
    return fetch(`${URL_PREFIX}/api/users`).then((res) => res.json());
  },

  createUser: (userObj) => {
    return fetch(`${URL_PREFIX}/api/users`, {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  },

  isValidToken: (token) => {
    return fetch(`${URL_PREFIX}/api/users/isValidToken`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  },

  login: (userObj) => {
    return fetch(`${URL_PREFIX}/api/users/login`, {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  },

  // Use this for profile pages (for editing AND storefront views)
  getSingleUser: (username) => {
    return fetch(`${URL_PREFIX}/api/users/getUser/${username}`).then((res) =>
      res.json()
    );
  },

  // Use this when a user wants to update their profile
  updateUser: (username, userObj) => {
    return fetch(`${URL_PREFIX}/api/users/getUser/${username}`, {
      method: "PUT",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  },

  deleteUser: (username) => {
    return fetch(`${URL_PREFIX}/api/users/getUser/${username}`, {
      method: "DELETE",
    }).then((res) => res.json());
  },

  // Use this to add a game to a user's collection
  addGameToCollection: (username, gameID) => {
    return fetch(`${URL_PREFIX}/api/users/addGame/${username}/${gameID}`, {
      method: "PUT",
    }).then((res) => res.json());
  },
};
