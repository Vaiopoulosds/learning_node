console.log("Before");
// getUser(1)
//   .then((user) => getRepo(user.gitHubUser))
//   .then((repos) => getCommits(repos[0]))
//   .then((commit) => console.log("commits", commit))
//   .catch((err) => console.log("Error", err.message));
console.log("After");

//Async and await
async function displayCommits () {
  try{
    const user = await getUser(1)
    const repositories = await getRepo(user.gitHubUser)
    const gitCommits = await getCommits(repositories)
    console.log(gitCommits)

  }catch (err){
    console.log(err.message)
  }
  
}
displayCommits()

function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Reading a user from a db");
      resolve({ id: id, gitHubUser: "stavros" });
    }, 2000);
  });
}

function getRepo(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Getting repos for " + username);
      // resolve(["repo1", "repo2", "repo3"]);
      reject(new Error('no repos'))
    }, 2000);
  });
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Calling github api..");
      resolve(["commit"]);
    }, 2000);
  });
}
