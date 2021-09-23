/* =================== START INPAGE NAVIGATION CODE ===================*/
// Global Navigation Variables
// inpage nav element
var inPageNav = document.getElementsByClassName("inPageNav")[0];
// inpage nav button toggle
var inPageNavButton = document.getElementsByClassName("inPageNav__btn")[0];
// inpage nav content wrapper div
var inPageNavContentWrapper = document.getElementsByClassName("inPageNav__content")[0];
// inpage nav links
var inPageNavLinks = document.querySelectorAll(".inPageNav__content a");
// get callback function if it exists
var inPageNavCallback = inPageNavButton.getAttribute("data-callback");
// get the first link and the last link for listeners
var inPageNavLinkInitial = inPageNavLinks[0];
if(inPageNavLinks){
  var inPageNavLinkCount = inPageNavLinks.length - 1;
  var inPageNavLinkFinal = inPageNavLinks[inPageNavLinkCount];
}
// variable to help know if initial setup has been completed
var inPageNavSetup = 1;

// Supporting functions
var inPageNavHelper = {
  init: function(){
    // add click event listener to button
    inPageNavButton.addEventListener("click", inPageNavHelper.inPageNavButtonClick);
    // setup ids for links and make sure they have matching sections and "back to nav" after each section
    inPageNavHelper.createRelationships();
    // add tracking listener if data attribute exists
    if(inPageNav.hasAttribute("data-setup-ga")){
      inPageNavHelper.setupGA();
    }
    // add breakpoint features
    inPageNavHelper.navWidthChanged();
  },
  navWidthChanged: function(){
    // setup breakpoints
    var navBreakpoint = inPageNav.getAttribute("data-breakpoint");
    var callbackMsg = "";
    // JavaScript Media Queries
    if (matchMedia) {
      var mq = window.matchMedia(navBreakpoint);
      mq.addListener(WidthChange);
      WidthChange(mq);
    }
    // media query change
    function WidthChange(mq) {
      if(mq.matches){
        // if it's >= min-width of desktop
        inPageNavHelper.desktopSetup();
      } else{
        // if it's < min-width of desktop
        inPageNavHelper.mobileSetup();
      }
    }
  },
  createRelationships: function(){
    // what we need to do is create relationships between the menu nav links,
    // the sections below, and build out return to nav
    for(var i = 0; i < inPageNavLinks.length; i++){
      var matchingSection = inPageNavLinks[i].getAttribute("href").replace("#","");
      var matchingSectionExists = document.getElementById(matchingSection);
      if(matchingSectionExists){
        inPageNavLinks[i].setAttribute("id", "nav-anchor-" + matchingSection);
        var returnToNav = document.createElement("div");
        var returnToNavLink = document.createElement("a");
        returnToNav.classList.add("inPageNav__back-wrapper");
        returnToNavLink.setAttribute("data-custom-label","return to navigation");
        returnToNavLink.addEventListener("click", inPageNavHelper.backToNavClick);
        returnToNavLink.classList.add("inPageNav__back-link");
        returnToNavLink.text = "Back to nav";
        returnToNavLink.setAttribute("href", "#nav-anchor-" + matchingSection);
        returnToNav.appendChild(returnToNavLink);
        matchingSectionExists.appendChild(returnToNav);
      } else{
        // remove the navigation link from the page because it's broken
        if(!inPageNavLinks[i].hasAttribute("ignore-link-check")){
          inPageNavLinks[i].closest("li").remove();
        }
      }
    }
  },
  backToNavClick: function(e){
    var setTarget = e.srcElement.getAttribute("href");
    if(!(window.getComputedStyle(inPageNavButton).display === "none")){
      e.preventDefault();
      inPageNavButton.focus();
      setTimeout(function(){
        inPageNavButton.click();
      }, 150);
      setTimeout(function(){
         window.location.href = setTarget;
      }, 250);
    }
    if(inPageNavCallback.length) {
      window[inPageNavCallback]("Back To Nav - " + setTarget);
    }                   
  },
  setupGA: function(){
    // we might be able to update the existing links to include the data attributes
    // for now I am preparing this to make a manual GA call
    for (var i = 0; i < inPageNavLinks.length; i++) {
      inPageNavLinks[i].setAttribute("data-custom-label", inPageNavLinks[i].innerHTML);
      inPageNavLinks[i].addEventListener("click", inPageNavHelper.fireGA);
    }
  },
  fireGA: function(){
    // set category and get text from link for label
    var setCat = "InPage Navigation";
    var setLabel = event.srcElement.getAttribute("data-custom-event");
    // below is where you would fire your GA call, internal ga call below won't work without custom package
    if (typeof sendCustomDimensions === "function") {
        // talentbrew analytics
        APP.MODELS.GoogleBot.sendCustomDimensions(setCat,'Click',setLabel,'event')
    }

  },
  desktopSetup: function(){
    // change up items in prep for desktop mode
    // remove aria-expanded attribute as button is not in use/hidden
    inPageNavButton.removeAttribute("aria-expanded");
    // remove all listeners that may have been added to hidden elements
    inPageNavHelper.removeListeners();

    // call custom callback and send TYPE of event that happened
    if(inPageNavCallback.length){
      if(inPageNavSetup == 1){
        window[inPageNavCallback]("Initial - Desktop Setup");
      } else{
        window[inPageNavCallback]("Change - Desktop Setup");
      }
      // makes it so that Initial Setup isn't sent again as msg
      inPageNavSetup = 0;
    }
  },
  mobileSetup: function(){
    // change up items in prep for mobile mode
    // add aria-expanded attribute and set to false by default
    inPageNavButton.setAttribute("aria-expanded", "false");

    // call custom callback and send TYPE of event that happened
    if(inPageNavCallback.length){
      if(inPageNavSetup == 1){
        window[inPageNavCallback]("Initial - Mobile Setup");
      } else{
        window[inPageNavCallback]("Change - Mobile Setup");
      }
      // makes it so that Initial Setup isn't sent again as msg
      inPageNavSetup = 0;
    }
  },
  inPageNavButtonClick: function(){
    // get current aria-expanded value
    var curStatus = inPageNavButton.getAttribute("aria-expanded");
    // set initial burger status for callback
    var callbackText = "closed";

    // current aria-expanded value
    if(curStatus == "true"){
      // remove listeners and set aria-expanded to false
      inPageNavButton.setAttribute("aria-expanded","false");
      callbackText = "Menu closed";
      inPageNavHelper.removeListeners();
    } else{
      // add listeners and set aria-expanded to true
      inPageNavButton.setAttribute("aria-expanded","true");
      callbackText = "Menu opened";
      inPageNavHelper.setupListeners();
    }
    // call custom callback and send TYPE of event that happened
    if(inPageNavCallback.length){
      window[inPageNavCallback](callbackText);
    }

  },
  listenerTabFirst: function(e){
    // make sure the user isn't going backwards
    if(e.shiftKey &&  e.which === 9 ){
      //custom code here
      inPageNavHelper.removeListeners();
    }
  },
  listenerTabLast: function(e){
    // add event listener to first-link and if (shif+tab) close menu
    if(!e.shiftKey &&  e.which === 9 ){
      //custom code here
      inPageNavHelper.removeListeners();
    }
  },
  listenerEscape: function(e){
    // if escape key is pressed while menu is open on mobile
    if(e.key === "Escape" ){
      //close all
      inPageNavHelper.removeListeners();
    }
  },
  listenerOutsideClick: function(){
      var isClickInside = inPageNav.contains(event.target);
      var isClickBurger = inPageNavButton.contains(event.target);
      if (!isClickInside && !isClickBurger) {
        // if user clicks outside of the navigation
        inPageNavHelper.removeListeners();
      }
  },
  removeListeners: function(){
    // removing event listeners from elements based on navigation needing to be closed on mobile
    inPageNavButton.setAttribute("aria-expanded","false");
    inPageNav.removeEventListener('keydown', inPageNavHelper.listenerEscape);
    document.removeEventListener('click', inPageNavHelper.listenerOutsideClick);
    inPageNavLinkInitial.removeEventListener('keydown', inPageNavHelper.listenerTabFirst);
    inPageNavLinkFinal.removeEventListener('keydown', inPageNavHelper.listenerTabLast);
  },
  setupListeners: function(){
    // adding event listeners based on the navigation menu button being activated
    inPageNav.addEventListener('keydown', inPageNavHelper.listenerEscape);
    document.addEventListener('click', inPageNavHelper.listenerOutsideClick);
    inPageNavLinkInitial.addEventListener('keydown', inPageNavHelper.listenerTabFirst);
    inPageNavLinkFinal.addEventListener('keydown', inPageNavHelper.listenerTabLast);
  }
}

// Initialize Navigation
if(inPageNav){
  inPageNavHelper.init();
}
