import { Template } from "meteor/templating";
import { ProductSearch } from "/lib/collections";

Template.searchInput.helpers({
  settings: () => {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: "",
          collection: ProductSearch,
          field: "title",
          template: Template.searchPill
        }
      ]
    };
  }
});
