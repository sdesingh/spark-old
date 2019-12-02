import * as controller from "./UserController";

export default [
  {
    path: "/adduser",
    method: "post",
    handler: controller.createUser
  },
  {
    path: "/user/:username",
    method: "get",
    handler: controller.getUser
  },
  {
    path: "/verify",
    method: "post",
    handler: controller.verifyUser
  },
  {
    path: "/login",
    method: "post",
    handler: controller.loginUser
  },
  {
    path: "/logout",
    method: "post",
    handler: controller.logoutUser
  },
  {
    path: "/follow",
    method: "post",
    handler: controller.followUser
  }
];
