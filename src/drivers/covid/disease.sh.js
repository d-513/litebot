import mongoose from "mongoose";
import axios from "axios";
const Cache = mongoose.model("Cache");
class CovidClient {
  constructor() {
    this.axios = axios.create({
      baseURL: "https://disease.sh/v3/covid-19/",
    });
  }

  async _doRequest(endpoint) {
    const dat = await Cache.findOne({ ca: "covid", key: endpoint });
    if (dat) {
      return dat.value;
    } else {
      const { data } = await this.axios.get(endpoint);
      await Cache.create({
        ca: "covid",
        key: endpoint,
        value: data,
      });
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
