import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleCookieParsing = (router: Router) => {
  router.use(cookieParser());
};

export const handleCookieSession = (router: Router) => {
  // expiration date.
  var date = new Date();

  // Add a day
  date.setDate(date.getDate() + 1);

  router.use(
    cookieSession({
      name: "spark",
      secret: process.env.SESSION_KEY,
      expires: date
    })
  );
};
