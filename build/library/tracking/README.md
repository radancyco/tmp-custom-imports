# TB Tracking

This is script that can be called onto a site via the custom importer `<script id="js-custom-imports" src="https://services1.tmpwebeng.com/custom-imports/custom-imports.js?scripts=tracking"></script>`

# Features

Does the tracking for the TB HUB
Makes it so that if there are TB data attributes for tracking and another JS on an element that it still triggers tracking.

# Use case

 For example if a button has the GA data attributes and Fancybox there is a possibilty that either the GA tracking will likely not fire or it will prevent the fancybox from firing. Once you have loaded the tracking script all you need to is remove `data-custom-event="true"` and add a class of `js-tb-click-tracking`

 **Original**
 `<button data-fancybox data-custom-event="true" data-custom-category="Click" data-custom-label="Video title (Video)">Play Video</button>`

**Tracking JS method**
 `<button class="js-tb-click-tracking" data-fancybox data-custom-category="Click" data-custom-label="Video title (Video)">Play Video</button>`