const schema = require("./config-schema.json");
const config = require("../speech-config.json");
const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true, useDefaults: true });

// Makes custom error messages in the schema possible
require("ajv-errors")(ajv);
const validate = ajv.compile(schema);

// Prints error and exists the program, if the validation does not work
if (!validate(config)) {
  console.error(
    "There are some errors in your speech-config.json:\n\n" +
      validate.errors
        .map((error) => error.message)
        .reduce((prev, current) => `${prev}${current}\n  - `, "  - ")
        .slice(0, -3)
  );
  process.exit(1);
}

module.exports = config;
