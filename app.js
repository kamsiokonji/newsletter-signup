import express, { response } from "express";
import bodyParser from "body-parser";
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const app = express();

const PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, "signup.html");
const successPath = path.resolve(__dirname, "success.html");
const failurePath = path.resolve(__dirname, "failure.html");

app.get("/", (req, res) => {
  res.sendFile(path.resolve(htmlPath));
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/0261f1decb";
  const options = {
    method: "POST",
    auth: "kamsi:b6695961006b67d4bb6da10a42eec6cf-us18",
  };

  const request = https.request(url, options, (response) => {
    response.statusCode === 200
      ? res.sendFile(path.resolve(successPath))
      : res.sendFile(path.resolve(failurePath));

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`It's alive on http://localhost:${PORT}`);
});

// apiKey
// b6695961006b67d4bb6da10a42eec6cf-us18

// audienceId
// 0261f1decb.
