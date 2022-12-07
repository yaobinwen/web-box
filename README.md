# React Box

## Overview

This repository has the notes and code of my study of React.js.

| Sub-directory | Purpose |
|--------------:|:--------|
| code | The main demonstration code. |
| topics | [deprecated] Demonstrate a particular topic. |

## Sub-directory: code

See `code/README.md` for more details.

## Sub-directory: topics

The `topics` folder has the notes of the subjects I have studied or am studying. Here is a brief list of them. See the `README` in each folder for more details.

- `five-types-of-state`: About how to manage the React.js app state.
- `test-async-component`: This topic studies how to test a React component that has asynchronous code. Typically, this kind of component, when rendered, fetches data from the back-end server and updates its own state, which makes the component not to settle down in a stable state until several rounds of updates.

## Notes

### Presentational and Container Components

In 2019, Dan updated his article [1] to say that he no longer suggests "splitting your components like this anymore":

> Update from 2019: I wrote this article a long time ago and my views have since evolved. In particular, I don’t suggest splitting your components like this anymore. If you find it natural in your codebase, this pattern can be handy. But I’ve seen it enforced without any necessity and with almost dogmatic fervor far too many times. The main reason I found it useful was because it let me separate complex stateful logic from other aspects of the component. [Hooks](https://reactjs.org/docs/hooks-custom.html) let me do the same thing without an arbitrary division. This text is left intact for historical reasons but don’t take it too seriously.

A **presentational component**:

- Is all about **what things look like**. It asks questions such as:
  - What are the hierarchy and layout of the children? Should child A below or above child B? Should there be a blank line in between them?
  - What are their styles?
- **Pure**. **Stateless**. Therefore, it never maintains its own states but receives data and callbacks via `props`.

A **container component**:

- As summarized in [2], is a component that **"does data fetching and then renders its corresponding sub-component"**.
- Is all about **how things work**. It can be viewed as a state machine and concerns about how states are transitioned. Because it concerns about state mutation, it usually subscribes to the changes of the data store.
- Typically **does NOT have DOM markups** such as `<ul>`, `<p>`, `<h1>`, etc..
- Renders another presentational or container component and passes data and behaviors (namely, functions) into these sub-components.

In the example in [2], the `CommentListContainer` (container) fetches data and passes them to `CommentList` (presenter). You don't see the DOM markups in `CommentListContainer.render`, but you see them in `CommentList.render`.

## References

- [1] [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [2] [Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)
