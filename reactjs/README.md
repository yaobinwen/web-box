# React.js and MUI Code

## Overview

This folder has the code that demonstrates various features of [React.js](https://reactjs.org/) and [MUI](https://mui.com/).

React.js has moved towards the trend of "functional components plus hooks" instead of the traditional class-based components. As of 2024-04-12, I found the following articles very helpful to get a good grasp of how React.js works:

- [Render and Commit](https://react.dev/learn/render-and-commit) explains how rendering works.
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot) suggests thinking about React.js's rendering process in "snapshots" to avoid possible "timing mistakes." Its example of "sending 'Hello' to Alice" shows this well.
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state):
  - "**Always declare component functions at the top level, and don't nest their definitions**".
  - "Specifying a **key** tells React to use the key itself as part of the position, instead of their order within the parent."
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) explains how to use the "reducer" hook.
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) explains how to use the "context" hook.
- [Referencing values with refs](https://react.dev/learn/referencing-values-with-refs) explains how to use the "ref" hook.
- The Effect-related articles talk intensively about how to use the Effect hook properly, including how to use it to do data fetching (also see [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/) and [Fixing Race Conditions in React with `useEffect`](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)):
  - [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
  - [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
  - [Lifecycle of Reactive Events](https://react.dev/learn/lifecycle-of-reactive-effects)
  - [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
  - [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
  - [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## How to use

Tools:

- `nodejs`: v14.18.2
- `yarn`: 1.22.15

Run `yarn install && yarn start` to launch the development server. The `.proto` files that are used in `code/src/components/DemoProtobuf.js` are compiled automatically by `yarn proto` (which is called by `yarn start`).

On the home page, click the top-left drop-down menu to choose the demo to show.

## Audit

When receiving the security alert notifications, run `yarn audit` to figure out what packages should be upgraded to what versions.

The article [_Yarn.lock: How to Update it_](https://dev.to/ayc0/yarn-lock-how-to-update-it-1fa2) mentions three ways to upgrade the packages:

- Manually editing the lock file to upgrade the resolved version. This gives you the flexibility to only upgrade the version of some of the dependencies. For example, the following case only ensures that version `1.1.5` is installed for `B@^1.1.1` and `B@^1.1.5`. If there is another dependency `B@^1.0.3` that's resolved to `1.0.3`, it will not be upgraded.

```
"B@^1.1.1", "B@^1.1.5":
  version "1.1.5"
  resolved "https://registry.yarnpkg.com/B-1.1.5.tgz#???"
  integrity sha512-???==
```

- The `resolutions` field in `package.json`. This may be simple but it forces to upgrade the version of **all** the dependencies to the specified version, potentially causing regression problems.
- Removing the `yarn.lock` file and re-install. "`yarn` will re-resolve all versions to the latest allowed by their specified ranges, and thus fix all those duplicated deps."

After upgrading the versions, make sure to run the code (`yarn start`) to see if the upgrade breaks anything.

## DemoProtobuf

This component demonstrates how to use [`protobuf.js`](https://github.com/protobufjs/protobuf.js) to read/write/verify/create a Protocol Buffers message/object. The key takeaway is: **If multiple `.proto` files belong to the same ProtoBuf package, then they should be compiled into the same static module.** The main reason is: If they are compiled into multiple `.js` modules, the one that's imported later will overwrite the package definition that's imported earlier. See `protos/package.proto` and `protos/protobuf.proto`. They both belong to the same package `demo_protobuf`. Initially, I compiled them into two `.js` modules separately: `package_pb.js` and `protobuf_pb.js`. However, when I imported them as follows:

```javascript
import awesome_pb from "../awesome_pb";
import hardware_pb from "../hardware_pb";
import package_pb from "../package_pb.js";
// Now `package_pb.demo_protobuf` exists.

import protobuf_pb from "../protobuf_pb.js";
// Now `package_pb.demo_protobuf` disappears.
```

I haven't looked into how `protobuf.js` works internally, but my observation is:

- `protobuf.js` compiles all the `.proto` files into the same root JavaScript module `root`. In other words, `package_pb` and `protobuf_pb` above are just aliases of `root` and they both point to the same object. This can be confirmed by inspecting the fields of `package_pb` and `protobuf_pb`. In the beginning, I thought `awesome_pb`, `hardware_pb`, `package_pb`, and `protobuf_pb` all pointed to different imported modules, but in fact they all pointed to the same one.

I guess this is why importing `protobuf_pb` could overwrite the `demo_protobuf` in `package_pb`: The code behind didn't check if `demo_protobuf` already exists and just appended new members to it.

This is why in the current `scripts/proto.sh`, `package.proto` and `protobuf.proto` are compiled into the same static module:

```shell
./node_modules/protobufjs-cli/bin/pbjs \
    -t static-module \
    -w es6 \
    -o src/demo_protobuf_pb.js \
    ./protos/package.proto \
    ./protos/protobuf.proto
```

## DemoProtobufGoogle

This component demonstrates how to use [`google-protobuf`](https://github.com/protocolbuffers/protobuf-javascript).

`google-protobuf` does not support constructing a protobuf message from a JSON object. Instead, they need to use an array to do that. For example, if we have a protobuf message like this:

```protobuf
message Msg {
    string part1 = 1;
    double part2 = 2;
}
```

We can't create a message as follows:

```javascript
let msg = new Msg({
  part1: "message",
  part2: 3.14,
});
```

Instead, we need to use an array (if we want to use protobuf `map`, we need to use array of arrays in JavaScript to construct it):

```javascript
let msg = new Msg([
  "message", // field 1
  3.14, // field 2
]);
```

The second constraint is: In google-protobuf, if we construct a message in the way shown above, there is no data type validation. Therefore, one can create a message as follows, and if one converts it to a JSON object, `part1` will be a number while `part2` a string:

```javascript
let msg = new Msg([
  123.4, // field 1, but it should be a string
  "3.14", // field 2, but it should be a double
]);
```

The validation seems to be only done during serialization and deserialization. So if one serializes and then deserializes the invalid message above, the data of wrong types will be stripped off (and it looks like the default values are used in the final object).

It looks like `google-protobuf` expects the user to create an empty message from a message type and then call various setters to set each field, then serialize for transmission and then deserialize and use getters to read values (and people do complain that this is inconvenient):

```javascript
let msg = new Msg()
msg.setPart1("message")
msg.setPart2(3.14)
let s = msg.serializeBinary()
// transmit
let d = Msg.deserializeBinary(s)
...
```
