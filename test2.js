const date = Date.now() + 0.5 * 60 * 1000;

//date after 10 minutes
setTimeout(() => {
  if (date > Date.now()) {
    console.log("hi");
  }
}, 29000);
