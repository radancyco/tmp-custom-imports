HUB is a JS based tool that when used with the TB Content Helper Razor can be used to dyamnicly bring in content pages and give users the control to filter those pages.

> **⚠ UPDATE (MAY 2022):** Topics are being phased out and should no longer be used a strategy for new HUBs. We are currently updating the UID Setup instructions to reflect this change. (Note: We will keep the documentation for the use of Topics available in this repository, for those assigned to a ticket dealing with an already-created HUB that is currently using Topics instead of Custom Facets.)

> **⚠ FOR GLOBAL SITE TYPES ONLY:** HUBs that live on a GST site are built with the Content Feed module instead of the Custom HTML module (detailed instructions can be found below.) Keep in mind that in its current form, the Content Feed module CANNOT be used as both a HUB *and* as Related Content on the same site. Until further notice is not possible for GST sites to have both a HUB and Related Content. It should also be noted that if a GST site may at any point utilize multi-lingual functionality, topics cannot be used as a prefilter for HUBs. Please check with Brock if you have any questions regarding these limitations.

First thing to do is make sure that you know all the requirements of the project:

# Prerequisites before development:
* Before you can even start a HUB you are required to have content pages (external or internal) on the site made in either TB or SS.​​​
* You should know how the client expects these pages to be organized and what information will be displayed on the card.
* ~~These content pages should have topic keys and values mapped to them already (This is done by the DPM/AT/Client).~~
* It needs to be already decided if the HUB will exist on its own content page or as an addition to an existing page.
* All HUBs should be prefiltered by the key `hubID` ​but you need to make sure the DPM provides the value.


# Glossary Terms:
https://tmpww.sharepoint.com/sites/delivery/SitePages/HUB%20Pages%20Implementation.aspx#glossary

# Use cases:
https://tmpww.sharepoint.com/sites/delivery/SitePages/HUB%20Pages%20Implementation.aspx#use-cases

---

# UID Setup for Full (Legacy) Site Type:
1. If the HUB will live on a content page, then setup a content page called HUB or has HUB in the name.
   * Note: if the Hub design does not call for the HUB to be on it’s own page then skip to step 2.

2. Create a CustomHTML module
   * use the naming convention of "HUB - [Function of this particular HUB]" and if you have multiple HUBs on several pages then add "- [Placement]" to the end
     * ie. SITE1, "HUB - Intern Stories"
     * ie. SITE2, "HUB - Events - Events Page", "HUB - Events - Home Page" and "HUB - Blog - Blog Page"
   * Replace all of the code in the CustomHTML module with the code from one of the following:
      * ~~If using topics: https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/hub-razor-using-topics.cshtml~~
      * If using custom facets: https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/hub-razor.cshtml

3. Assign the CustomHTML Module to the page that it will be displayed on.
  * i.e Home Page or Content Page

4. Edit the SASS file for the TB and copy and paste all of the code from https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/scss/hub-defaults.scss (if it is not already present in your SASS file)

5. Without making any changes to the configurations push your changes to your preview site and test to make sure it is working. (If no pages load in, then use the DIAGNOSTICS feature of allowing content pages with no mapping to appear. Often the step of mapping content pages is missed ad the HUB can not work without mappings.)
   * You should be able to click on each filter dropdown and see what is currently mapped to all content pages in the system.

6. Check the ticket for any configuration information (this ideally should be in the ticket description but also could be a file attached to the ticket) and update the options in the module razor
   * Make sure to read all comments in the razor, as that will help you know what to change and give you examples of how to customize.
   * Make sure to get the correct value from the ticket for the prefilter being based on `hubID`.
   * You may want to add additional prefilters for when you know you will need a section in the card to have a value.

7. SASS Edits
   * Try to keep the same naming convention
   * If you have several HUBs, most cases the only difference is the HUB Items, so you should add a class to .hub__wrapper to style it differently and in SASS nest that class inside of the .hub-item wrapper via an ampersand. As demonstrated here https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/scss/hub-defaults.scss#L261

8. Make sure to update the recommended size for thumbnails
   * Go to each Self Service Theme > Image Settings > Related Content
   * Recommended min-width is 700px (keep the same aspect ratio as the images provided in the PSD)
   * This same size should be used in your lazy loading configurations in the module razor

---

# UID Setup for Global Site Type (GST):
1. If the HUB will live on a content page, then setup a content page called HUB or has HUB in the name.
   * Note: if the Hub design does not call for the HUB to be on it’s own page then skip to step 2.

2. Create a Content Feed module
   * use the naming convention of "HUB - [Function of this particular HUB]" and if you have multiple HUBs on several pages then add "- [Placement]" to the end
     * ie. SITE1, "HUB - Intern Stories"
     * ie. SITE2, "HUB - Events - Events Page", "HUB - Events - Home Page" and "HUB - Blog - Blog Page"
   * In the **Administrator Tools** side panel, navigate to **Design System &rarr; Modules &amp; Forms &rarr; Hub - Show 3 onload and 3 learn more** (Or use this link: https://tbadmin.talentbrew.com/layoutmanagement/editdesignlayoutitem/37). Copy this code and use it to replace all of the code in the Content Feed module's Layout.

3. Assign the Content Feed Module to a section, and then assign that section to the page that it will be displayed on.
  * i.e Home Page or Content Page

4. Edit the SASS file for the TB and copy and paste all of the code from https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/scss/hub-defaults.scss (if it is not already present in your SASS file)

5. Edit the Content Feed module
    * Check the ticket for any configuration information (this ideally should be in the ticket description but also could be a file attached to the ticket) and update the options in the Content Feed module's **Prefiltering** and **Hub Filtering** settings as needed. Prefiltering determines which pages will show up in the HUB without any user selections, while Hub Filtering determines how the user is able to filter the HUB results.
    * Upload a default thumbnail image in the module's main settings. This is the image that will show in the results if a content page does not have a thumbnail image.

6. Now push your changes to your preview site and test to make sure the HUB is working.
   * If you see the message *No results found, please come back later*, this means that the content pages require mappings to meet the prefiltering requirements. Often the step of mapping content pages is missed. To verify that the HUB is working, you can remove the facet limit(s) in the Content Feed module's **Prefiltering** settings.
   * You should be able to click on each filter dropdown and see what is currently mapped to all content pages in the system.

7. SASS Edits
   * Try to keep the same naming convention
   * If you have several HUBs, most cases the only difference is the HUB Items, so you should add a class to .hub__wrapper to style it differently and in SASS nest that class inside of the .hub-item wrapper via an ampersand. As demonstrated here https://github.com/radancyco/tmp-custom-imports/blob/main/build/library/hub/scss/hub-defaults.scss#L261

8. Update the lazy loading configurations for thumbnail image size in the Content Fees module's Layout razor.
   * Recommended min-width is 700px (keep the same aspect ratio as the images provided in the PSD/Zeplin file)
   * If any of the thumbnail images appear distorted or stretched, make sure that every content page's thumbnail image aspect ratio is the same as the PSD/Zeplin file

---

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
* Go to content page priority to verify that there are content pages with the correct mapping 
