import * as controller from "./MediaController";

export default [
  {
    path: "/addmedia",
    method: "post",
    handler: controller.addMedia
  },
  {
    path: "/media/:id",
    method: "get",
    handler: controller.getMedia
  }
];
