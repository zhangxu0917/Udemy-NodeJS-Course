const fetchData01 = (callback) => {
  setTimeout(() => {
    callback("fetchData01 Done!");
  }, 1500);
};

const fetchData02 = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("fetchData02 Done!");
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log("Timer is done!");
  fetchData01((text) => {
    console.log(text);
  });

  fetchData02()
    .then((text) => {
      console.log(text);
      return fetchData02();
    })
    .then((text) => {
      console.log(text);
    });
}, 2000);

console.log("Hello!");
console.log("Hi!");
