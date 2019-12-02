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
    path: "/item/:id",
    method: "delete",
    handler: controller.deleteItem
  }
];
