# README: How to Test An Asynchronous Component

## Introduction

I started to study this subject because I needed to test the asynchronous React components in my project. I read the Jest documentation about [_Testing Asynchronous Code_](https://jestjs.io/docs/en/asynchronous), but the examples used in the Jest document assume the fetched data is handled by a callback function. But the components I needed to handle didn't use the callbacks. Instead, the fetched data were directly handled in the `then` clause.

For example, instead of having a method like `fetchData(callback)`, my components are more like this:

```javascript
class MyComponent extends Component {
    fetchStatus() {
        fetch(url).then((response) => {
            this.setState({
                status: response.body
            });
        };
    }
}
```

Although I could modify the code to pass in a `callback` to those fetch functions, I were reluctant to do so because there were many of such calls in my code base. I wanted to find an approach to test the asynchronous code without having to modify all the code to have a callback.

## Presentational And Container Components

Although I read Dan's article [_Presentational and Container Components_](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) when I started to code in React.js, I did't start to actually understand it until I've built more first-hand experience recently. Separating the components into `container` and `presentation` is helpful in terms of testing because:

- For `container` components, which are likely to fetch data from the server, the skills I studied in this topic are useful. We may need to use [full DOM rendering](https://airbnb.io/enzyme/docs/api/mount.html) so they can go through the entire lifecycle, including the data fetching, in order to be tested.
- For `presentation` components, they are more suitable for [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) using [shallow rendering](http://airbnb.io/enzyme/docs/api/shallow.html)[*] because they are mostly stateless and independent. Note that, as Dan says in his article, being "stateless" means "rarely have their own state", but when they do, it's "UI state rather than data".
  - [*] React.js also provides shallow rendering API: [Shallow Renderer](https://reactjs.org/docs/shallow-renderer.html).
