import * as controller from "./SearchController";

export default [
  {
    path: "/search",
    method: "post",
    handler: controller.search
  }
];
