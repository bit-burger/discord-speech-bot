// Copied and modified from https://stackoverflow.com/a/21947851/15396325 and https://stackoverflow.com/a/49392671/15396325

// Object to capture process exits and call app specific cleanup function

module.exports = function cleanup(callback) {
  // Do app specific cleaning before exiting
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, () => {
      callback();
      process.removeAllListeners();
      process.exit(1);
    });
  });

  // Catch uncaught exceptions and give better
  process.on("uncaughtException", function (e) {
    console.error("Exited with an error:\n" + e.toString());
    process.removeAllListeners();
    process.exit(1);
  });
};
