/* /* This file have API routes for user api mobile .  */
const express = require("express");
var redis = require("redis");
var JWTR = require("jwt-redis").default;
var redisClient = redis.createClient({
  url: "redis://redis-18481.c256.us-east-1-2.ec2.cloud.redislabs.com:18481",
});
redisClient.auth("fVqHLTto8CS2wPttDOELp8jOeWCwJ3My");
var jwtr = new JWTR(redisClient);
const configJwt = require("../config/jwt.json");
const controllers = require("../controllers/userController.js");
const langString = require("../locales/attributes.json");
const models = require("../models");
const apiRoutes = express.Router();

/*list all categories for spinner*/
apiRoutes.post("/login", controllers.login);
apiRoutes.post("/register", controllers.register);

apiRoutes.post(
  "/check_forget_password_code",
  controllers.check_forget_password_code
);
apiRoutes.post(
  "/send_forgot_password_code",
  controllers.send_forgot_password_code
);
apiRoutes.post("/update_password_by_code", controllers.update_password_by_code);

apiRoutes.post("/check_mobile", controllers.check_mobile);
apiRoutes.post("/check_email", controllers.check_email);

apiRoutes.get("/about", controllers.get_about_data);

apiRoutes.post("/latest_maps", controllers.latest_maps);
apiRoutes.post("/list_showrooms", controllers.list_showrooms);
apiRoutes.get("/list_decore_types", controllers.list_decore_types);

apiRoutes.get("/list_sliders", controllers.list_sliders);
apiRoutes.post("/list_media_centers", controllers.list_media_centers);
apiRoutes.post("/get_page_title", controllers.get_page_title);
apiRoutes.post("/calculate_decore_price", controllers.calculate_decore_price);
apiRoutes.get("/get_company_progress", controllers.get_company_progress);

apiRoutes.post("/list_news", controllers.list_news);
apiRoutes.post("/get_news_by_id", controllers.get_news_by_id);

apiRoutes.get("/list_cities", controllers.list_cities);
apiRoutes.get("/list_subjects", controllers.list_subjects);
apiRoutes.get("/list_jobs", controllers.list_jobs);

apiRoutes.get("/get_whatsapp_phone", controllers.get_whatsapp_phone);

apiRoutes.get("/list_areas", controllers.list_areas);
apiRoutes.post("/list_magazines", controllers.list_magazines);
apiRoutes.get("/get_recruitment_data", controllers.get_recruitment_data);

apiRoutes.use(async function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  let language_code = req.language;
  // decode token
  if (token) {
    // verifies secret and checks exp
    let decoded = await jwtr
      .verify(token, configJwt.secret)
      .then((decoded) => {
        if (decoded == undefined) {
          req.user = null;
          next();
        } else {
          models.User.findOne({ where: { id: decoded.user } })
            .then((user) => {
              if (!user) {
                req.user = null;
                next();
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.user = user;
                req.user.token = token;
                req.device = decoded.device;
                next();
              }
            })
            .catch((error) => {
              req.user = null;
              next();
            });
        }
      })
      .catch((error) => {
        req.user = null;
        next();
      });
  } else {
    // if there is no token  return an error
    req.user = null;
    next();
  }
});

apiRoutes.post("/list_projects", controllers.list_projects);
apiRoutes.post("/list_projects_by_city", controllers.list_projects_by_city);
apiRoutes.post("/list_projects_by_area", controllers.list_projects_by_area);
apiRoutes.post("/latest_projects", controllers.latest_projects);
apiRoutes.post("/get_project_by_id", controllers.get_project_by_id);

apiRoutes.post("/upload_cv", controllers.upload_cv);

apiRoutes.use(async function (req, res, next) {
  // check header or url parameters or post parameters for token
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  let language_code = req.language;
  // decode token
  if (token) {
    let decoded = await jwtr
      .verify(token, configJwt.secret)
      .then((decoded) => {
        if (decoded) {
          if (decoded.type != 1) {
            //
            msg = langString[language_code].not_authorize;
            return res.status(403).json({ msg: msg, status: "403" });
          } else {
            models.User.findOne({ where: { id: decoded.user } })
              .then((user) => {
                if (!user) {
                  msg = langString[language_code].not_authorize;
                  return res.status(403).send({ msg: msg, status: "403" });
                } else if (user && user.is_block == 1) {
                  msg = langString[language_code].user_blocked;
                  return res.status(421).send({ msg: msg, status: "421" });
                } else {
                  // if everything is good, save to request for use in other routes
                  req.decoded = decoded;
                  req.user = user;
                  req.user.token = token;
                  req.device = decoded.device;
                  if (user.lang != language_code) {
                    user.lang = language_code;
                    user.save().then((data) => {
                      next();
                    });
                  } else {
                    next();
                  }
                }
              })
              .catch((error) => {
                return res
                  .status(500)
                  .send({ msg: error.message, status: "500" });
              });
          }
        } else {
          // if there is no token  return an error
          msg = langString[language_code].not_authorize;
          return res.status(403).send({ msg: msg, status: "403" });
        }
      })
      .catch((error) => {
        msg = langString[language_code].not_authorize;
        return res.status(403).send({ msg: msg, status: "403" });
      });
  } else {
    // if there is no token  return an error
    msg = langString[language_code].not_authorize;
    return res.status(403).send({ msg: msg, status: "403" });
  }
});

apiRoutes.post("/list_user_wishlist", controllers.list_user_wishlist);
apiRoutes.post("/add_to_wishlist", controllers.add_to_wishlist);

apiRoutes.get("/get_user_data", controllers.get_user_data);
apiRoutes.post("/get_user_progress", controllers.get_user_progress);

apiRoutes.post("/update_user_data", controllers.update_user_data);
apiRoutes.post("/send_feedback", controllers.send_feedback);
apiRoutes.post("/request_call", controllers.request_call);
apiRoutes.post("/update_password", controllers.update_password);
apiRoutes.post("/change_language", controllers.change_language);
apiRoutes.post("/logout", controllers.logout);

apiRoutes.post("/import_contact", controllers.import_contact);

apiRoutes.post("/list_user_units", controllers.list_user_units);
apiRoutes.post("/payment_amount", controllers.payment_amount);
apiRoutes.post("/list_user_payments", controllers.list_user_payments);
apiRoutes.post("/postpone_payment", controllers.postpone_payment);
apiRoutes.post("/refresh_fcm_token", controllers.refresh_fcm_token);

apiRoutes.post("/request_decore", controllers.request_decore);

module.exports = apiRoutes;
