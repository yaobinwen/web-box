#!/bin/sh
# -*- mode: sh; tab-width: 8; indent-tabs-mode: nil; sh-basic-offset: 4 -*-

set -e

# =============================================================================
# For `protobuf.js`

# `awesome.proto` is from the official example.
# See https://github.com/protobufjs/protobuf.js#using-proto-files
./node_modules/protobufjs-cli/bin/pbjs \
    -t static-module \
    -w es6 \
    -o src/awesome_pbjs.js \
    ./protos/awesome.proto

# demo_protobuf package.
./node_modules/protobufjs-cli/bin/pbjs \
    -t static-module \
    -w es6 \
    -o src/demo_protobuf_pbjs.js \
    ./protos/package.proto \
    ./protos/protobuf.proto

# Hardware configuration.
./node_modules/protobufjs-cli/bin/pbjs \
    -t static-module \
    -w es6 \
    -o src/hardware_pbjs.js \
    ./protos/hardware/hardware_config/v0/*.proto

# =============================================================================
# For `google-protobuf`

# awesome.proto
protoc \
    --proto_path=./protos \
    --js_out=import_style=commonjs,binary:src \
    awesome.proto

# complex.proto
protoc \
    --proto_path=./protos \
    --js_out=import_style=commonjs,binary:src \
    complex.proto

# package.proto
protoc \
    --proto_path=./protos \
    --js_out=import_style=commonjs,binary:src \
    package.proto

# vim: set expandtab shiftwidth=4:
