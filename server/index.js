const express = require("express");
const cors = require("cors");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

const app = express();
app.use(cors());
app.disable('x-powered-by');

// const VueCookies = require('vue-cookies');
// app.use(VueCookies);
// VueCookies.config('7d');

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
