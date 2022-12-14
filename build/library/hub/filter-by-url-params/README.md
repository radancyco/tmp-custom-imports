# Triggering Hub Filtering By URL Parameters

Using the JS code in this folder, we are able to trigger hub filter(s) selection and filter form submission based on URL query parameters.

For example, let's say we have we a hub featured on a page with a url such as **www.yoursite.com/blog**, and this hub is set up to include a user-controlled dropdown to filter hub content by Category. We can use this code so that if a query parameter and value are added to the URL (for example, **www.yoursite.com/blog?category=Nursing**) the page is loaded with "Nursing" selected from the Category filter dropdown and the hub content is filtered to only show content pages that are mapped to the Nursing category.

## Notes

-   The code includes validation for URL parameters and values. For example, if the user visits a URL with an invalid parameter or value - meaing that the parameter is not an actual filter dropdown or the value is not an actual option in the dropdown's select menu (for example, **www.yoursite.com/blog?InvalidParam=Nursing** or **www.yoursite.com/blog?category=InvalidValue**) then the hub content is loaded without any filter form actions performed. The same result occurs if the paramer is missing a value (for example, **www.yoursite.com/blog?category=** or **www.yoursite.com/blog?category**.)

-   This code can be used to filter by multiple URL parameters (for example, **www.yoursite.com/blog?category=Nursing&location=New%20York,%20NY%20(City)**) or to filter multiple hubs on the same page.

## Instructions

1. Copy/paste the correct JS code into your theme's JS file. If your hub is implemented on a Legacy site using a Custom HTML module for the hub section, use [the legacy version]https://github.com/radancyco/tmp-custom-imports/tree/main/build/library/hub/filter-by-url-params/filter-by-url-params_legacy.js. If your hub is implemented on a GST site using a Content Feed module, use [the GST version]https://github.com/radancyco/tmp-custom-imports/tree/main/build/library/hub/filter-by-url-params/filter-by-url-params_gst.js.

2. If your hub is implemented on GST site using a Content Feed module: Choose a **unique** class name for your hub section and add this class to the parent `<div>` in your Content Feed module layout codes. For example:

`<div class="js-hub hub__wrapper content-feed unique-class-name" id="@hubId" >`

3. Locate the last code block in the script, where you'll see the `'hubInitialized'` (Legacy) or `'contentFeedInitialized'` (GST) event listener. In this event listener you'll need to replace the arguments in the `filterByUrlParam()` function call with the correct values for your hub. If your hub is implemented on a GST site using a Content Feed Module, the first argument should be the hub section's unique class name mentioned above (for example, `'.unique-class-name'`). If your hub is implemented on a legacy site using a Custom HTML module, the first argument should be the hub section's id (By default this is `'#data-hub-1'` but double-check to be sure.) The second argument will always be the filter name (for example, `'category'` or `'location'`.) Note: if you're filtering by more than one URL parameter, this function will need to be called for each filter/parameter.

4. Be sure to publish all changes to preview, and then test the filtering by URL parameter functionality.
