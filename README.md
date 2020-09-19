# accessible-components

[![GitHub release](https://img.shields.io/github/v/tag/dotherightthing/accessible-components)](https://github.com/dotherightthing/accessible-components/releases) [![Build Status](https://github.com/dotherightthing/accessible-components/workflows/Build%20and%20release%20if%20tagged/badge.svg)](https://github.com/dotherightthing/accessible-components/actions?query=workflow%3A%22Build+and+release+if+tagged%22) [![GitHub issues](https://img.shields.io/github/issues/dotherightthing/accessible-components.svg)](https://github.com/dotherightthing/accessible-components/issues)

## Single Select

Design Pattern: [Listbox](https://www.w3.org/TR/wai-aria-practices/#Listbox)

> A listbox widget presents a list of options and allows a user to select one or more of them. A listbox that allows a single option to be chosen is a single-select listbox; one that allows multiple options to be selected is a multi-select listbox.

### ARIA: listbox role

<https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role>

> The listbox role is used to identify an element that creates a list from which a user may select one or more static items, similar to the HTML `<select>` element. Unlike `<select>`, a listbox can contain images. Each child of a listbox should have a role of option.

### Collapsible

* <https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html>
* <https://www.scottohara.me/blog/2018/05/05/hidden-vs-none.html>

## Tabbed Carousel

> We do not call carousels "sliders" so the difference to the slider pattern (selecting a value in a min/max range) is obvious.
>
> Before you continue, please read Tablist widgets (or: tab panels, tabs) to understand why carousels are extended variants of tablists, simply providing additional controls like previous/next buttons, and sometimes autoplay functionality.
>
> Source: [Accessibility Developer Guide: Carousels (or: slideshow, slider)](https://www.accessibility-developer-guide.com/examples/widgets/carousel/)

## Unit tests

```shell
npx cypress run
```
