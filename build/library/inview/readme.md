# Inview Script

Note: this script is using custom-imports-v1_5

## Initial Setup

Add this code, ideally at the whole site level. Like in GST you can add this at the settings page.

```
   <input type="hidden" data-ci-script="inview"/>
   <script src="https://services1.tmpwebeng.com/custom-imports/custom-imports-v1_5.js"></script>>
```

If you are on Legacy you can add this to your Scripts module. https://codedrive.io/#/snippets/145


```
   // Custom Imports v1.5 will run on all pages
   Html.AddScriptBlock(
        @<text>
            <input type="hidden" data-ci-script="inview"/>
            <script src="https://services1.tmpwebeng.com/custom-imports/custom-imports-v1_5.js"></script>>

        </text>
    );
```

You will also need to add this to your JS

```
    $(document).on('ciLoadedAScript', function (e) {
        var scriptName = e.detail.script;
    
        if (scriptName == "inview") {
            ciInView.Init(false);
        }
    });
```


## Classes to use
Add `prod-check-inView` class to any element you want to check for

You can modify how quickly it determines the element is in view by addtionally adding one of the following classes
`prod-wait-till-fully-inView`
`prod-wait-till-half-inView`
`prod-wait-till-mostly-inView`

If you want it so that the element can be retriggered when in view then you can add this class `prod-ivVew-recheck`

When an element comes in view the class `element-exposed` will be added to it. 


## Example SCSS
Here is an example of triggering animation of 

Avoid stylying directly on just `.element-exposed` and on `prod-check-inView` Instead add a class that will be the animation.
This allow allows you to use one inview triogger when you want to animate multiple elements inside of a section.

```
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// For accesibility reasons we make sure we can easily seperate the animations classes from other styling classes so the user can turn off animations 
@media (prefers-reduced-motion: no-preference) {

  .fadeIn,
  .fadeIn--slow {    
    // first we make all instances of this transparent. 
    opacity: 0;
  }

  .element-exposed {
    // Having both these classes one with the ampersand and one without allows you to animate directly on the element that is in view 
    // or an element that's parent has come into view.
    .fadeIn,
      &.fadeIn {
        animation: fadeIn .5s ease-in-out .5s forwards;

        // this modifer allows you to easily have differnt speed animations
        &--slow {
          //.fadeIn--slow
          animation: fadeIn 1s ease-in-out .5s forwards;

        }

      }
    }


}
```

