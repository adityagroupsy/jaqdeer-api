var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
let bodyParser = require("body-parser");
var usersRouter = require("./routes/users");
var app = express();
global.basicPathImage = "https://dashboard.jadeergroup.com/public/images/";
var fs = require("fs");
var https = require("https");
app.use(cors());

//limit: '50mb'
app.use(cookieParser());
app.use(logger("dev"));
app.disable("etag");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

var http = require("http");
const basicAuth = require("express-basic-auth");
//basic auth for apis
app.use(
  basicAuth({
    users: { jadeer: "jadeer@2020#" },
    unauthorizedResponse: getUnauthorizedResponse,
  })
);
function getUnauthorizedResponse(req) {
  //req.auth.user , req.auth.password
  return req.auth
    ? { msg: "Credentials rejected", status: "401" }
    : { msg: "No credentials provided", status: "401" };
}
app.use(function (req, res, next) {
  var language = req.headers["accept-language"];
  if (!["ar", "en"].includes(language)) {
    res.statusMessage = "invalid_language";
    return res.status(412).send({ msg: "invalid_language", status: "412" });
  } else {
    req.language = language;
    next();
  }
});
app.use("/user", usersRouter);
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  return res.json({ msg: "error", error: err.message, status: "500" });
});

app.get("*", function (req, res) {
  res.status(404).json({ msg: "not_found", status: "404" });
});
app.post("*", function (req, res) {
  res.status(404).json({ msg: "not_found", status: "404" });
});
/*

var privateKey  = fs.readFileSync('./config/ssl.key', 'utf8');
var certificate = fs.readFileSync('./config/ssl.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
*/
// your express configuration here
var httpServer = http.createServer(app);

//var httpsServer = https.createServer(credentials, app);
const os = require("os");
httpServer.listen(6003, () => {
  console.log(os.hostname());
});
//httpServer.listen(6001);
//httpsServer.listen(6002);

module.exports = app;
