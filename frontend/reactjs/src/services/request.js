import axios from "axios";
import firebase from "firebase/compat/app";

export function requestWithoutAuth(url, options) {
  const headers = options.headers || {};

  return axios({
    method: options.method,
    url,
    headers: { ...headers },
    data: options.body,
  });
}

export default function request(url, options) {
  const headers = options.headers || {};
  return firebase
    .auth()
    .currentUser.getIdToken(true)
    .then((idToken) => {
      const auth = { Authorization: `Bearer ${idToken}` };
      return axios({
        method: options.method,
        url,
        headers: { ...auth, ...headers },
        data: options.body,
      });
    });
}
