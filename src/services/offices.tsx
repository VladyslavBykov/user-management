import axios from "axios";

export function getOfficesList() {
  return axios
    .get(`https://yoc-media.github.io/weather/api/offices.json`)
    .then((res) => res.data);
}
