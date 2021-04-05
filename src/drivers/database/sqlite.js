import Knex1 from "knex";
const knex = Knex1({
  client: "sqlite3",
  connection: {
    filename: "db.sqlite",
  },
  useNullAsDefault: true,
});

(async () => {
  if (!(await knex.schema.hasTable("guild_settings"))) {
    await knex.schema.createTable("guild_settings", (t) => {
      /*
      gid - guild id
      settings - json of server settings
      */
      t.string("gid");
      t.json("settings");
    });
  }

  if (!(await knex.schema.hasTable("warnings"))) {
    await knex.schema.createTable("warnings", (t) => {
      /*
      gid - guild id
      uid - user id
      giver_id - id of admin that warned the person
      */
      t.increments("id");
      t.string("gid");
      t.string("uid");
      t.string("giver_id");
      t.string("reason");
    });
  }

  if (!(await knex.schema.hasTable("cache"))) {
    await knex.schema.createTable("cache", (t) => {
      t.increments("id");
      t.string("key");
      t.string("value");
      t.timestamp("timestamp");
    });
  }
})();

export class WarningManager {
  constructor() {}

  async getWarns(uid, gid) {
    return await knex("warnings").where({ gid, uid }).select();
  }

  async addWarn(gid, uid, giver_id, reason) {
    await knex("warnings").insert({
      gid,
      uid,
      giver_id,
      reason,
    });
  }
}

export class Cache {
  constructor(prefix, timeout) {
    this._prefix = prefix;
    this._timeout = timeout;
  }

  async get(key) {
    const a = await knex("cache")
      .where({
        key: `${this._prefix};${key}`,
      })
      .andWhere("timestamp", ">", (Date.now() - this._timeout).toString())
      .select();
    return a[0] ? a[0].value : false;
  }

  async set(key, value) {
    await knex("cache").insert({
      key: `${this._prefix};${key}`,
      value: value,
      timestamp: Date.now(),
    });
  }
}
