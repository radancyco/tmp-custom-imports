# In Page Navigation

This is a in page navigation that scrolls to anchors and has a back to navigation for accessibility.

# UID Setup:
* This is script that can be called onto a site via the custom importer `<script id="js-custom-imports" src="https://services1.tmpwebeng.com/custom-imports/custom-imports.js?scripts=inpagenav"></script>`

* Use this SCSS https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/inpagenav/inpagenav.scss

* Use this HTML https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/inpagenav/inpagenav.html

# PARAMETERS:

* `nav[data-breakpoint="(min-width: 000px)"]`
  This script uses matchMedia which allows us to more efficiently check client width on tackle events when thresholds are broken.

* `nav[data-setup-ga]`
  This will apply GTM events to each of the links and the burger.

* `button[data-callback="YourFunctionNameHere"]`
  This will tell the JavaScript what callback function to send messages to when various events take place. Messages returned to developer function will be:
  * Menu Opened - When mobile menu is opened
  * Menu Closed - When mobile menu is closed
  * Initial - Desktop Setup - The first time the page is loaded and initial setup is run, if the browser is in desktop mode it * will send this message.
  * Initial - Mobile Setup - The first time the page is loaded and initial setup is run, if the browser is in desktop mode it will send this message.
  * Change - Desktop Setup - The browser has gone from mobile to using desktop (not initial setup), so the desktop setup change has happened.
  * Change - Mobile Setup - The browser has gone from desktop to mobile (not initial setup), so the mobile setup change has happened.
  * Back To Nav - #nav-section-id - The system creates a back-to-nav div and link after each of the sections on the page that are being linked to. When clicked the callback will receive that notice as well as what link in the nav they are going back to.
  
*  `a[ignore-link-check]`
If a link in the list does not have a corresponding section with the same id this script will remove that item so that its not erroneously added to the page. If you need to ignore that check for a link that may be redirecting to an external page, you would apply this attribute to that link.

# Troubleshooting
Ask Drew Hill
