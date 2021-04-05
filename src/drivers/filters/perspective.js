import { Velocity } from "velocity-api";

const velocity = new Velocity(process.env.PERSPECTIVE_KEY);
const attributes = {
  INSULT: 0.9,
  TOXICITY: 0.9,
  IDENTITY_ATTACK: 0.9,
};

export default async function analyze(text) {
  const attr = [];
  for (const key in attributes) {
    attr.push(key);
  }
  const scores = await velocity.processMessage(text, {
    attributes: attr,
    languages: ["en"],
    doNotStore: true,
  });
  const data = {};
  for (const key in scores) {
    const value = scores[key];
    if (value > attributes[key]) {
      data[key] = true;
    } else {
      data[key] = false;
    }
  }
  return data;
}
