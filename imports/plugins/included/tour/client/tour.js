import introJs from "intro.js";
import { Reaction } from "/client/api";
import { Meteor } from "meteor/meteor";
import { Accounts } from "/lib/collections";

const tour = introJs.introJs();
const adminTourSteps = [
  {
    intro: `<h2>Welcome to <strong>Reaction</strong> Commerce</h2>
    <hr>
    <div>
      <strong>Reaction</strong> is the first ecommerce solution for small and medium-sized businesses
      that will provide real time merchandising, real time pricing and promotions, and live monitoring of conversions.
      <br>This brief tour would introduce you to the important controls to help you navigate and effectively 
      use our platform
    </div>`
  },
  {
    intro: `<h2>Products</h2>
    <hr>
    <div>
      All available products would be displayed here. Just browse through.<br>
      When you find that product you have been searching for, click on it and proceed to adding it to your cart.
      <br><strong>OR</strong>
      <br>As a Vendor/Admin you can edit, update, delete your products by clicking on them to visit the product detail page.
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
      Click on the cart icon to check out. <br>
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
    <div style="height:200px; overflow-y: scroll;">
      Here we have several other options to help you customize your account, and also get the best out of 
      <strong>Reaction</strong> Commerce. Just choose from one of the following options available in the dropdown shown in the screen shot below
      <ol>
        <li>
          <strong>Profile: </strong>view and update your profile details.
        </li>
        <li>
          <strong>Wallet: </strong>  Fund your wallet, transfer funds to other users wallet and more.
        </li>
        <li>
          <strong>Dashboard: </strong> View your dashboard. Manage the various packages offered by <strong>Reaction</strong>
        </li>
        <li>
          <strong>Orders: </strong> Checkout orders for your products and carry out actions related to your customers orders
        </li>
        <li>
          <strong>Add Products: </strong> Add new products to your shop
        </li>
        <li>
          <strong>Account: </strong> View and manage accounts of your clients.
        </li>
        <li>
          <strong>Actionable Analytics: </strong> Analyse data from your users and products to guide in making improving 
          your market strategies
        </li>
        <li>
          <strong>Sign out: </strong> Though we hate to see you leave, if need arises you can always logout to keep your account 
          safe from unathorized access. <br>
          You can always log back in by clicking the same account button next time.
        <l/i>
      <ol>
      <img src= "/resources/admin_account.png" class="product-grid-item-images img-responsive">
    </div>`
  },
  {
    element: ".admin-controls-menu",
    intro: `<h2>Admin Controls</h2>
    <hr>
    <div style="height:200px; overflow-y: scroll;">
      There are several functionalities available to you as an Admin/Vendor to futher customize you experience on your store.
      Quick access to this functionalities are available through the controls which appear here.
      Do note that besides the functionalities which appear here, you can view and manage all packages available to you by clicking on the 
      dashboard control
      <br>
      Examples are:
      <ol>
        <li>
          <strong>Dashboard: <span></strong><img src= "/resources/dashboard.png" class="product-grid-item-images img-responsive"></span>
        </li>
        <li>
          <strong>Orders: <span></strong><img src= "/resources/orders.png" class="product-grid-item-images img-responsive"></span>
        </li>
        <li>
          <strong>Accounts: <span></strong><img src= "/resources/admin_accounts.png" class="product-grid-item-images img-responsive"></span>
        </li>
        <li>
          <strong>Actionable Analytics: <span></strong><img src= "/resources/actionable_analytics.png" class="product-grid-item-images img-responsive"></span>
        </li>
        <li>
          <strong>Add Products: <span></strong><img src= "/resources/add_product.png" class="product-grid-item-images img-responsive"></span>
        </li>
      </ol>
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

const registeredBuyerTourSteps = [
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
      Also note that search results appear instantly as you type.
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
      Click on the cart icon to check out. <br>
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
      Here you can access several other account related options by clicking to reveal the dropdown:
      <ol>
        <li>
          <strong>Profile:</strong> view your profile, update your profile and even upgrade your account to a Vendor account
        </li>
        <li>
          <strong>Wallet:</strong> Fund your wallet, transfer funds to other users wallet and more.
        </li>
        <li>
          <strong>Sign-out:</strong> Though we hate to see you leave, if need arises you can always logout to keep your account 
          safe from unathorized access. <br>
          You can always log back in by clicking the same account button next time.
        </li>
        <img src= "/resources/guest_account.png" class="product-grid-item-images img-responsive">
      </ol>
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
  } else if (!Reaction.hasPermission("anonymous")) {
    tourSteps = registeredBuyerTourSteps;
  } else {
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
