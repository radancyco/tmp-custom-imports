HUB is a JS based tool that when used with the TB Content Helper Razor can be used to dyamnicly bring in content pages and give users the control to filter those pages.

First thing to do is make sure that you know all the requirements of the project:

# Prerequisites before development:
* Before you can even start a HUB you are required to have content pages on the site, either made in TB or SS.​​​
* You should know how the client expects these pages to be organized and the content pages.
* These pages should have facet mapping applied to them already (This is done by the DPM/AT/Client).
* It needs to be already decided if the HUB will exist on its own content page or as an addition to an existing page.​


# Glossary Terms: 
https://tmpww.sharepoint.com/sites/delivery/SitePages/TB%20HUB.aspx#glossary

# Use cases: 
https://tmpww.sharepoint.com/sites/delivery/SitePages/TB%20HUB.aspx#use-cases

# UID Setup:
1. If the HUB will live on a content page, then setup a content page called HUB or has HUB in the name.
   * Note: if the Hub design does not call for the HUB to be on it’s own page then skip to step 2. 

2. Create a CustomHTML module
   * use the naming convention of "HUB - [Function of this particular HUB]" and if you have multiple HUBs on several pages then add "- [Placement]" to the end
     * ie. SITE1, "HUB - Intern Stories"
     * ie. SITE2, "HUB - Events - Events Page", "HUB - Events - Home Page" and "HUB - Blog - Blog Page"
   * Replace all of the code in the CustomHTML module with the code from https://github.com/tmpworldwide/tmp-custom-imports/blob/gh-pages/build/library/hub/hub-razor.cshtml

3. Assign the CustomHTML Module to the page that it will be displayed on. 
  * i.e Home Page or Content Page

4. Edit the SASS file for the TB and copy and paste all of the code from https://github.com/tmpworldwide/tmp-custom-imports/blob/gh-pages/build/library/hub/scss/hub-defaults.scss

5. Without making any changes to the configurations push your changes to your preview site and test to make sure it is working. (If no pages load in, then use the DIAGNOSTICS feature of allowing content pages with no mapping to appear. Often the step of mapping content pages is missed ad the HUB can not work without mappings.)
   * You should be able to click on each filter dropdown and see what is currently mapped to all content pages in the system.

6. Now go through the configuration questions https://tmpww.sharepoint.com/sites/delivery/SitePages/TB%20HUB.aspx#hub-questions and update the options in the module razor
   * Make sure to read all comments in the razor, as that will help you know what to change and give you examples of how to customize
   * Filter by Forms, by default all options are visible, Do NOT delete the @addfilter, instead if you want to not have the filter visible change the 1 to a 0 for that filter.

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

* hubFeature.sortHub("#data-hub-1","data-hub-date-updated", 1);
* hubFeature.sortHub("#data-hub-1","data-hub-date-created", 2);
* hubFeature.sortHub("#data-hub-1","data-hub-title", 2);
* hubFeature.sortHub("#data-hub-1","data-weight", 1);
* hubFeature.sortHub("#data-hub-1","data-hub-event-date", 1);

# Troubleshooting
## Firefox is not sorting by date correctly
Make sure your sort criteria is using the mm/dd/yyyy format if it is using mm-dd-yyyy then you can change it in razor wiht .Replace("-","/); 
