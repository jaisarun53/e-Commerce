import crypto from "crypto";
// this is not the part of project
const getRandomText = () => {
  const randomText = crypto.randomBytes(10).toString("hex");
  console.log(randomText);
};
getRandomText();
