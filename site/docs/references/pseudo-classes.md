---
id: references/pseudo-classes
title: Pseudo-Classes
layout: docs
---

In addition to CSS's native [pseudo-classes](https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-classes), **Stylable** enables you to define custom pseudo-classes so that you can apply styles to your components based on state.

Let's say you want a component to have different styling applied to it when its content is loading. You can define `loading` as a custom pseudo-class and toggle it in your component.

Native pseudo-classes like `:hover` and `:nth-child()` are valid and supported natively.

## Define custom pseudo-classes

To define custom pseudo-classes, you use the **Stylable** directive rule `-st-states` to provide a list of the possible custom pseudo-classes that you want to use in the CSS.

The `-st-states` directive rule can be defined only for simple selectors like [tag selector](./tag-selectors.md), [class selector](./class-selectors.md) and [root](./root.md).

## Name custom pseudo-classes and assign a style to them

To define custom pseudo-classes, or states, for a simple selector, you tell **Stylable** the list of possible custom states that the CSS declaration may be given. You can then target the states in the context of the selector. In this example `toggled` and `loading` are added to the root selector and then assigned different colors. 

```css
/* example1.st.css */
@namespace "Example1";
.root {
    -st-states: toggled, loading;
}
.root:toggled { color: red; }
.root:loading { color: green; }
.root:loading:toggled { color: blue; }
```

```css
/* CSS output*/
.Example1__root[data-Example1-toggled] { color: red; }
.Example1__root[data-Example1-loading] { color: green; }
.Example1__root[data-Example1-loading][data-Example1-toggled] { color: blue; }
```



## Future: custom pseudo-classes with parameters

in some use cases its usefull to define custom states the use one or more parameter to indicate which nodes to activate on. 

for example a cell in a grid can be marked using column and row pseudo classes

```css
/* stateWithNumberParam.st.css */
.token{
    -st-states: column(number), 
                row(number), 
                loaded(percentage), 
                tag(tag), 
                size( "small | large")
}

.token:column(1):row(1){
    color:red;
}

.token:loading(">0.5"){
    color:red;
}


.token:tag(food){
    color:red;
}


.token:size(small){
    color:red;
}

```

```css
/* CSS output*/
.Example1__root[data-Example1-column1][data-Example1-row1] { color: red; }

```

### Types and allowed prefixes

Stylable supports a number of parameter types for pseudo-classes:


| Type | Allowed validations | Allowed prefixes | definition with no validations | definition with validations |
|----|----|----|----|----|
| String | minLength, maxLength | 


* string
    * allowed input validations
        * minLength
        * maxLength
    allowed prefixes
    *   ~ - match whole words
    *   ^ - match start
    *   $ - match end
    *   \* - match include
* number 
    allowed input validations:
    * min
    * max
    * multipleOf
    allowed prefixes
    *   \> - greater then - future
    *   \< - lesser then - future
* boolean 
    * only exact matches are supported
* tag - whole word matches
* enum

    allowed input validations:
    * min
    * max
    * multipleOf
    * only exact matches are supported
* percentage
    allowed prefixes
    *   \> - greater then - future
    *   \< - lesser then - future


#### String example

```css
/* stateWithNumberParam.st.css */
.token{
    -st-states: fieldName(string);
}

/* customize fields with fieldName email */
.token:fieldName(email){
    color:lightBlue;
}

/* customize fields with fieldName that starts with user_ */
.token:fieldName(^user_){
    color:blue;
}

/* customize fields with fieldName that ends with _id */
.token:fieldName($_id){
    color:gray;
}

/* customize fields with fieldName that includes error */
.token:fieldName(*error){
    color:red;
}


/* using includes with "not" operator */
.token:fieldName(!*error){
    border:1px solid green;
}
```

```css
/* CSS output*/
.Example1__root[data-Example1-fieldName="email"] { color: lightBlue; }
.Example1__root[data-Example1-fieldName^="user_"] { color: blue; }
.Example1__root[data-Example1-fieldName$="_id"] { color: gray; }
.Example1__root[data-Example1-fieldName*="error"] { color: red; }
.Example1__root:not([data-Example1-fieldName*="error"]) { color: red; }

```


#### Number example

```css
/* stateWithNumberParam.st.css */
.token{
    -st-states: column(number());
}

/* customize fields with at column 1 */
.token:column(1){
    color:lightBlue;
}

/* customize column greater then 1 ( FUTURE ) */
.token:column(>1){
    color:blue;
}

```



```css
/* CSS output*/
.Example1__root[data-Example1-fieldName="email"] { color: lightBlue; }
.Example1__root[data-Example1-fieldName="^user_"] { color: blue; }
.Example1__root[data-Example1-fieldName="$_id"] { color: gray; }
.Example1__root[data-Example1-fieldName="*error"] { color: red; }

```

```css
/* stateWithNumberParam.st.css */
.token{
    -st-states: column(number), 
                row(number), 
                loaded(percentage), 
                tag(tag), 
                size( "small | large")
}

.token:column(1):row(1){
    color:red;
}

.token:loading(">0.5"){
    color:red;
}


.token:tag(food){
    color:red;
}


.token:size(small){
    color:red;
}

```

```css
/* CSS output*/
.Example1__root[data-Example1-column1][data-Example1-row1] { color: red; }

```

> **Note**    
> You can also override the behavior of native pseudo-classes. This can enable you to write [polyfills](https://remysharp.com/2010/10/08/what-is-a-polyfill) for forthcoming CSS pseudo-classes to ensure that when you define a name for a custom pseudo-class, if there are clashes with a new CSS pseudo-class in the future, your app's behavior does not change. We don't recommend you to override an existing CSS pseudo-class unless you want to drive your teammates insane.

## Extend external stylesheet

You can extend another imported stylesheet and inherit its custom pseudo-classes. In this example the value `Comp1`is imported from the `example1.css` stylesheet and extended by `.mediaButton`. The custom pseudo-classes `toggled` and `selected` are defined to be used on the `mediaButton` component. 

```css
/* example2.st.css */
@namespace "Example2";
:import {
    -st-from: "./example1.st.css";
    -st-default: Comp1;
}
.mediaButton {
    -st-extends: Comp1;
    -st-states: toggled, selected;
}
.mediaButton:hover { border: 0.2em solid black; } /* native CSS because no custom declaration*/
.mediaButton:loading { color: silver; } /* from Example1 */
.mediaButton:selected { color: salmon; } /* from Example2 */
.mediaButton:toggled { color: gold; } /* included in Example1 but overridden by Example2 */
```

```css
/* CSS output*/
.Example1__root[data-Example1-toggled] { color: red; }
.Example1__root[data-Example1-loading] { color: green; }
.Example2__root .Example2__mediaButton:hover { border: 0.2em solid black; } /* native hover - not declared */
.Example2__root .Example2__mediaButton[data-Example1-loading] { color: silver; } /* loading scoped to Example1 - only one to declare */
.Example2__root .Example2__mediaButton[data-Example2-selected] { color: salmon; } /* selected scoped to Example2 - only one to declare */
.Example2__root .Example2__mediaButton[data-Example2-toggled] { color: gold;} /* toggled scoped to Example2 - last to declare */
```

## Map custom pseudo-classes

You can use this feature to define states even if the existing components you are targeting are not based on **Stylable**. In this example, `toggled` and `loading` are defined on the root class with their custom implementation. **Stylable** generates selectors using custom `data-*` attributes. The CSS output uses the custom implementation defined in `-st-states` rather than its default generated `data-*` attributes.

```css
/* example-custom.st.css */
@namespace "ExampleCustom";
.root {
    -st-states: toggled(".on"), loading("[dataSpinner]");
}
.root:toggled { color: red; }
.root:loading { color: green; }
```

```css
/* CSS output*/
.ExampleCustom__root.on { color: red; }
.ExampleCustom__root[dataSpinner] { color: green; }
```

> **Note**    
> When writing custom mappping, ensure your custom selector targets a simple selector, and not a CSS child selector.

## Enable custom pseudo-classes

Custom pseudo-classes are implemented using `data-*` attributes and need additional runtime logic to control when they are on and off. 

**Stylable** offers [React CSS state integration](../getting-started/react-integration.md) to help components manage custom pseudo-classes easily.

{% raw %}

```jsx
/* render of stylable component */
render() {
    return <div style-state={{ /* used in stylable-react-integration to implement pseudo-classes */
        toggled:true,
        selected:false
    }} ></div>
}
```

{% endraw %}
