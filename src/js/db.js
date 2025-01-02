import Dexie from "dexie";

let db;

const createDb = (name) => {
  db = new Dexie(name);

  db.version(1).stores({
    cache: "id",
  });
};

export { db, createDb };
