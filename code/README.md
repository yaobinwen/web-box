# Code

## Overview

This folder has the code that demonstrates various features of [React.js](https://reactjs.org/) and [MUI](https://mui.com/).

## How to use

Tools:
- `nodejs`: v14.18.2
- `yarn`: 1.22.15

Run `yarn install && yarn start` to launch the development server. The `.proto` files that are used in `code/src/components/DemoProtobuf.js` are compiled automatically by `yarn proto` (which is called by `yarn start`).

On the home page, click the top-left drop-down menu to choose the demo to show.

## DemoProtobuf

This component demonstrates how to use [`protobuf.js`](https://github.com/protobufjs/protobuf.js) to read/write/verify/create a Protocol Buffers message/object. The key takeaway is: **If multiple `.proto` files belong to the same ProtoBuf package, then they should be compiled into the same static module.** The main reason is: If they are compiled into multiple `.js` modules, the one that's imported later will overwrite the package definition that's imported earlier. See `protos/package.proto` and `protos/protobuf.proto`. They both belong to the same package `demo_protobuf`. Initially, I compiled them into two `.js` modules separately: `package_pb.js` and `protobuf_pb.js`. However, when I imported them as follows:

```javascript
import awesome_pb from '../awesome_pb'
import hardware_pb from '../hardware_pb'
import package_pb from '../package_pb.js'
// Now `package_pb.demo_protobuf` exists.

import protobuf_pb from '../protobuf_pb.js'
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
