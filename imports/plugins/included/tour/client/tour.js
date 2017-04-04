import introJs from "intro.js";
import { Reaction } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Accounts } from "/lib/collections";

const tour = introJs.introJs();

const unregisteredBuyerTourSteps = [
  {
    intro: `<h2>Welcome to <strong>Reaction</strong> Commerce</h2>
    <hr>
    <div>
      <strong>Reaction</strong> Commererce is your one stop ecommerce platform for all types of goods and services.<br>
      This brief tour would help you get up and running with our platform.
    </div>`
  },
  {
    intro: `<h2>Products</h2>
    <hr>
    <div>
      All available products would be displayed here. Just browse through.<br>
      When you find that product you have been searching for, click on it and proceed to adding it to your cart.
    </div>`
  },
  {
    element: ".search",
    intro: `<h2>Search</h2>
    <hr>
    <div>
      With countless number of products waiting to be checked out, we help you 
      discover that product you're looking for by offering you an intuitive to use 
      search system with the following capabilities:
      <ol>
        <li>Sorting products search results in Ascending or Descending price range.</li>
        <li>Filter products search results based on tags</li>
        <li>Filter products search results by brands</li>
        <li>Sort products search results based on the product sales</li>
        <li>Sort product search results based on their creation date (newest item)</li>
      </ol>
      Search results appear instantly as you type.
      <br> Found that product ? Click on it's icon, and proceed to adding it to your cart
    </div>`
  },
  {
    element: ".cart",
    intro: `<h2>My Cart</h2>
    <hr>
    <div>
      Yeah, So you've found that product or those products and added them to you cart.
      It's time to check out.<br>
      Click on the cart icon to cash out. <br>
      Note that we presently offer only 3 means of payment: 
      <ol>
        <li>
          <strong>Wallet</strong>
        </li>
        <li>
          <strong>Example Payment</strong>
        </li>
        <li>
          <strong>Paystack</strong>
        </li>
      </ol>
    </div>`
  },
  {
    element: ".languages",
    intro: `<h2>Languages</h2>
    <hr>
    <div>
      Language should never be a barrier. <br> We understand that the earth is a global village, where everyone 
      is connected and we aim to provide our services to everyone around the world regardless of their language.<br>
      Just click on language icon and select you preferred language from the dropdown.
    </div>`
  },
  {
    element: "#accounts",
    intro: `<h2>Account Options</h2>
    <hr>
    <div>
      To buy a product you would need to register and that's straight forward :<br>
      Either click on this Icon to reveal a dropdown where you can enter needed details to register <strong>OR</strong><br>
      When you click on your cart to checkout, you would also be presented with the compulsory registration option to proceed
      with your purchase.
    </div>`
  },
  {
    element: ".tour",
    intro: `<h2>Tour</h2>
    <hr>
    <div>
      That's about everything. Ever need to take a tour again, you can find me here.
    </div>`
  }
];

const updateTakenTour = () => {
  if (!Accounts.findOne(Meteor.userId()).takenTour) {
    Accounts.update({ _id: Meteor.userId() }, { $set: { takenTour: true } });
  }
};

export function playTour() {
  let tourSteps;
  if (Reaction.hasPermission("admin")) {
    tourSteps = adminTourSteps;
  } // else if (!Reaction.hasPermission("anonymous")) {
  //   tourSteps = registeredBuyerTourSteps;
  else {
    tourSteps = unregisteredBuyerTourSteps;
  }
  tour.setOptions({
    showBullets: true,
    showProgress: true,
    scrollToElement: true,
    showStepNumbers: false,
    tooltipPosition: "auto",
    steps: tourSteps
  });
  tour.onexit(updateTakenTour)
  .oncomplete(updateTakenTour);
  tour.start();
}
