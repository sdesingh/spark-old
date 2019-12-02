import * as controller from "./ItemController";

export default [
  {
    path: "/additem",
    method: "post",
    handler: controller.addItem
  },
  {
    path: "/item/:id",
    method: "get",
    handler: controller.getItem
  },
  {
    path: "/user/:username/posts",
    method: "get",
    handler: controller.getItemsByUser
  },
  {
    path: "/item/:id",
    method: "delete",
    handler: controller.deleteItem
  },
  {
    path: "/item/:id/like",
    method: "post",
    handler: controller.likeItem
  }
];
