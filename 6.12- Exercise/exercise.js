const sentEmails = async () => {
  try {
    const customer = await getCustomer(1);
    console.log(customer);
    if (customer.isGold) {
      const topMovies = await getTopMovies();
      console.log(topMovies);
      const sendMail = await sendEmail(customer?.email, topMovies);
      console.log(sendMail);
    }
  } catch (err) {
    console.log("Error", err);
  }
};

sentEmails();

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Mosh Hamedani",
        isGold: true,
        email: "email",
      });
    }, 2000);
  });
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["movie1", "movie2"]);
    }, 2000);
  });
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Email sent..");
    }, 2000);
  });
}
