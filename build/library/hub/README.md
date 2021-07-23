HUB is a JS based tool that when used with the TB Content Helper Razor can be used to dyamnicly bring in content pages and give users the control to filter those pages.

> **⚠ REMEMBER: Check to see if your site has Topics enabled. If it is not enabled and it is the first time a HUB is being setup for the site then tag Bulmer and Brock on your ticket requesting the Topics flag to be enabled. If there is already a HUB on the site and already pages mapped to that HUB using custom facets discuss with your DPM/CSS the possibility of moving the client over to using Topics.

First thing to do is make sure that you know all the requirements of the project:

# Prerequisites before development:
* Before you can even start a HUB you are required to have content pages (external or internal) on the site made in either TB or SS.​​​
* You should know how the client expects these pages to be organized and what information will be displayed on the card.
* These content pages should have topic keys and values mapped to them already (This is done by the DPM/AT/Client).
* It needs to be already decided if the HUB will exist on its own content page or as an addition to an existing page.
* All HUBs should be prefiltered by the key `hubID` ​but you need to make sure the DPM provides the value.


# Glossary Terms:
https://tmpww.sharepoint.com/sites/delivery/SitePages/HUB%20Pages%20Implementation.aspx#glossary

# Use cases:
https://tmpww.sharepoint.com/sites/delivery/SitePages/HUB%20Pages%20Implementation.aspx#use-cases

# UID Setup:
1. If the HUB will live on a content page, then setup a content page called HUB or has HUB in the name.
   * Note: if the Hub design does not call for the HUB to be on it’s own page then skip to step 2.

2. Create a CustomHTML module
   * use the naming convention of "HUB - [Function of this particular HUB]" and if you have multiple HUBs on several pages then add "- [Placement]" to the end
     * ie. SITE1, "HUB - Intern Stories"
     * ie. SITE2, "HUB - Events - Events Page", "HUB - Events - Home Page" and "HUB - Blog - Blog Page"
   * Replace all of the code in the CustomHTML module with the code from one of the following:
      * If using topics: https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/hub-razor-using-topics.cshtml
      * If using custom facets: https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/hub-razor.cshtml

3. Assign the CustomHTML Module to the page that it will be displayed on.
  * i.e Home Page or Content Page

4. Edit the SASS file for the TB and copy and paste all of the code from https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/scss/hub-defaults.scss

5. Without making any changes to the configurations push your changes to your preview site and test to make sure it is working. (If no pages load in, then use the DIAGNOSTICS feature of allowing content pages with no mapping to appear. Often the step of mapping content pages is missed ad the HUB can not work without mappings.)
   * You should be able to click on each filter dropdown and see what is currently mapped to all content pages in the system.

6. Check the ticket for any configuration information (this ideally should be in the ticket description but also could be a file attached to the ticket) and update the options in the module razor
   * Make sure to read all comments in the razor, as that will help you know what to change and give you examples of how to customize.
   * Make sure to get the correct value from the ticket for the prefilter being based on `hubID`.
   * You may want to add additional prefilters for when you know you will need a section in the card to have a value.
   * Filter by Forms, by default all options are visible, Do NOT delete the `@addfilter`, instead if you want to not have the filter visible change the 1 to a 0 for that filter.

7. SASS Edits
   * Try to keep the same naming convention
   * If you have several HUBs, most cases the only difference is the HUB Items, so you should add a class to .hub__wrapper to style it differently and in SASS nest that class inside of the .hub-item wrapper via an ampersand

8. Make sure to update the recommended size for thumbnails
   * Go to each Self Service Theme > Image Settings > Related Content
   * Recommended min-width is 700px (keep the same aspect ratio as the images provided in the PSD)
   * This same size should be used in your lazy loading configurations in the module razor

# Advanced topics
## Commands in console that can be used to test sorting
( hub ID, Sort Criteria, sort direction ) Note: 0 = random / 1 = Descending / 2 = Ascending

* `hubFeature.sortHub("#data-hub-1","data-hub-date-updated", 1);`
* `hubFeature.sortHub("#data-hub-1","data-hub-date-created", 2);`
* `hubFeature.sortHub("#data-hub-1","data-hub-title", 2);`
* `hubFeature.sortHub("#data-hub-1","data-weight", 1);`
* `hubFeature.sortHub("#data-hub-1","data-hub-event-date", 1);`

## Listening for HUB events
* Hub Initialized means that the prefilters and form filters have been setup
   You can listen for this event via the following function and even determine when all HUBs on the page have initialized.
``` javascript
$(document).on('hubInitialized', function (e) {
    console.log('Initialized for hubID: ' + e.detail.hubID + ' Number of HUBs to initialize: ' + e.detail.index + ' All HUBs initialized: ' + e.detail.final)
})
```

* There are some HUB interactions you can listen for as well, not all of them will provide a number of results data.
   Interaction Types: resetFilters, filterByButtonData, filterByFormData
``` javascript
$(document).on('hubInteraction', function (e) {
    console.log('HUB Event for hubID: ' + e.detail.hubID + ' Interaction Type: ' + e.detail.interactionType + ' Number of Results: ' + e.detail.numberOfResults )
})
```

## Triggering the form to filter outside of the normal filter
   * **IMPORTANT:** It is highly recommended to never hide any of the filters because when the user uses the reset filter button then the hidden filter would also be removed unknowingly to the user.
``` javascript
function triggerHubFilter (hubID, filter, value){
  $(hubID + '-' + filter).val(value).change();
  $(hubID + ' .js-hub-submit-filters').trigger('click');
}
```

* Also remember to wait for the HUB to initialize

``` javascript
var numberOfHubs = $('.js-hub').length;
var numberOfInitialized = $('.js-hub.initialized').length;
// First check if it already initialized before your script has ran
if (numberOfHubs == numberOfInitialized) {
      triggerHubFilter('#data-hub-1', 'category', 'Sales' )
} else {
   // If not then listen for the event that all HUBs have initialized
  $(document).on('hubInitialized', function (e) {
    if(e.detail.final) {
      triggerHubFilter('#data-hub-1', 'category', 'Sales' )
    }
  })
}

```

# Troubleshooting
No content pages are showing.
* Go to the general setting of your page to make sure that under search facets your DPM has setup facets.
* Go to content page pirority to verify that there are content pages with the correct mapping 
