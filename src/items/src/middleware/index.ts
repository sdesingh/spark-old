import {
  handleCompression,
  handleBodyRequestParsing,
  handleCors
} from "./common";

export default [handleCompression, handleCors, handleBodyRequestParsing];
