import axios from "axios";

export function getPublishersList() {
  return axios
    .get(`https://yoc-media.github.io/weather/api/publishers.json`)
    .then((res) => res.data);
}
