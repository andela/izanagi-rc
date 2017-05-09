import { ExampleSettingsFormContainer } from "../containers";
import { Template } from "meteor/templating";
import "./paystack.html";

Template.exampleSettings.helpers({
  ExampleSettings() {
    return {
      component: ExampleSettingsFormContainer
    };
  }
});
