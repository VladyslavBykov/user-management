import axios from "axios";
import { User } from "../types/user";

function fetchLocalUsers(users: User[]): User[] {
  const localUsers = localStorage.getItem("users");
  if (localUsers && localUsers.length > 0) {
    //fetch
    return JSON.parse(localUsers);
  } else {
    updateLocalUsersList(users);
    return users;
  }
}

export function updateLocalUsersList(users: User[]): void {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getUsersList() {
  return axios
    .get(`https://yoc-media.github.io/weather/api/users.json`)
    .then((res) => {
      const users: User[] = fetchLocalUsers(res.data);
      return users;
    });
}
