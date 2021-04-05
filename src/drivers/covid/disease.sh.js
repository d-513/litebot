import { Cache } from "../database/default";
import axios from "axios";

class CovidClient {
  constructor() {
    this.axios = axios.create({
      baseURL: "https://disease.sh/v3/covid-19/",
    });
    this.cache = new Cache("corona", 10 * 1000 * 60);
  }

  async _doRequest(endpoint) {
    if (await this.cache.get(endpoint)) {
      return JSON.parse(await this.cache.get(endpoint));
    } else {
      const { data } = await this.axios.get(endpoint);
      this.cache.set(endpoint, JSON.stringify(data));
      return data;
    }
  }

  all() {
    return this._doRequest("/all");
  }

  country(name) {
    return this._doRequest(`/countries/${name}`);
  }

  state(name) {
    return this._doRequest(`/states/${name}`);
  }

  continent(name) {
    return this._doRequest(`/continents/${name}`);
  }

  countries() {
    return this._doRequest(`/countries?sort=cases`);
  }
}

export default CovidClient;
