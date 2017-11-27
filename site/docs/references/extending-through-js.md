# Extending through JS

At stylable we love CSS and we love JS, we'd like them to get a room, on our build servers.

but we'd rather most of our JS code executes at build time. leaving a much better performing App.

we also care about dev experience, so we everyone to be able to extend stylable while keeping completions and type checks.


## stylable types

stylable types represent the available types in CSS. they try to follow the spirit of the houdini future spec. 

available types and validations:

* color
    * allow opacity
* size unit
    * allowed units
    * min
    * max
    * multiplesOf
* percentage
    * min
    * max
    * multiplesOf
* calc string
* image
* number
    * min
    * max
    * multiplesOf
* enum
    * allowed values
* native enums:
    * lineStyle
    * display
    * bezierCurves


stylable uses JS Docs to infer JS extension signatures

## Extending through formaters:

formaters are JS methods manipulating parameters to produce a string value.


for example the following CSS code :

```css

:import{
    -st-from:"../my-formater.js"
    -st-named:lighten;
    -st-default:fmt;
}

.myClass{
    color: lighten(30,#ff0000);
    background-color: fmt(80,#ff0000)
}

```

and the following JS code can be used together:

```js

import {darken, lighten as polishedLighten} from 'polished';
/**
* Lighten - lightens a color by a percentage.
* @param {stylable.percentage} [amount=50] - How much to lighten.
* @param {stylable.color} color - The color to lighten
* @returns {stylable.color}
*/
export function lighten(amount,color){
    return polishedLighten(amount,color);
}

/**
* Darken - darkens a color by a percentage.
* @param {stylable.percentage} [amount=50] - How much to darken.
* @param {stylable.color} color - The color to darken
* @returns {stylable.color}
*/
export default function darken(amount,color){
    return darken(amount,color);
}

```


## Extending through mixins:

in many cases its usefull to generate bigger chunks of css through js.

heres an example creating and using an expandOnHover mixin:

```css

:import{
    -st-from:"../my-mixins.js"
    -st-named:expandOnHover;
}

.myClass{
    -st-mixin:expandOnHover(200,2);
}

```


```jsx

/**
* Expand
* @param {stylable.number} [durationMS=200] {min:0,max:3000} - total animation time MS
* @param {stylable.percentage} [increaseBy=1.5] - how much to increase size;
* @param {stylable.bezierCurves} [animationCurve=cubicEaseIn] - animation change over time curve
* @returns {stylable.CssFragment}
*/
export function expandOnHover(durationMS,increaseBy,animationCurve){
    return {
        transition:"all "+duration+"ms "+animationCurve;,
        ":hover":{
            transform:scale(increaseBy)
        }
    }
}

```


## TypeScript and Babel

we love typescript and babel and are working to make JS extensions using them possible as soon as we can.
