import { isRevisionControlEnabled } from "/imports/plugins/core/revisions/lib/api";
import { ProductDetailContainer, PublishContainer } from "../containers";
import { Template } from "meteor/templating";

Template.productDetailSimple.helpers({
  isEnabled() {
    return isRevisionControlEnabled();
  },
  PDC() {
    return ProductDetailContainer;
  }
});

Template.productDetailSimpleToolbar.helpers({
  PublishContainerComponent() {
    return {
      component: PublishContainer
    };
  }
});

Template.disqus.helpers({
  getDisqus() {
    const script = document.createElement("script");
    script.src = "https://izanagi-rc.disqus.com/embed.js";
    script.setAttribute("data-timestamp", + new Date());
    (document.head || document.body).appendChild(script);
  }
});
