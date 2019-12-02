import {
  handleCompression,
  handleBodyRequestParsing,
  handleCors,
  handleCookieSession,
  handleCookieParsing
} from "./common";

export default [
  handleCompression,
  handleCors,
  handleBodyRequestParsing,
  handleCookieSession,
  handleCookieParsing
];
