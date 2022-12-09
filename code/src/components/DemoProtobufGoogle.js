// 3rd-party
import Accordion from '@mui/material/Accordion'
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid'
import React from 'react'

// Ours
let awesome_pb = require('../awesome_pb')
let complex_pb = require('../complex_pb')
let package_pb = require('../package_pb')

class DemoProtobufGoogle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      awesome_tests: [],
      complex_tests: [],
      package_tests: [],
    }
  }

  run_tests = (MessageType, state_field, payloads) => {
    let tests = []
    for (let payload of payloads) {
      let message = new MessageType(payload)
      let object = message.toObject()
      let serialized = message.serializeBinary()
      let message2 = MessageType.deserializeBinary(serialized)
      let object2 = message2.toObject()
      tests.push({
        payload: payload,
        message: message,
        object: object,
        serialized: serialized,
        message2: message2,
        object2: object2,
      })
    }

    let state = {}
    state[state_field] = tests
    this.setState(state)
  }

  componentDidMount = () => {
    this.run_tests(
      awesome_pb.AwesomeMessage,
      "awesome_tests",
      [
        null,
        {},
        {
          "awesomeField": 1,
        },
        [1],
        [3.1415926],
        [true],
        [
          {
            key1: "value1",
            key2: "value2",
          }
        ],
        ["abc"],
      ],
    )

    this.run_tests(
      complex_pb.Complex,
      "complex_tests",
      [
        undefined,
        {},
        [
          // 1 (Complex) (type: string)
          'a_string',
          // 2 (Complex) (Not used, so left empty)
          undefined,
          // 3 (Complex) (Not used, so left empty)
          undefined,
          // 4 (Complex) (type: Nested)
          [
            // 1 (Nested) (Not used, so left empty)
            undefined,
            // 2 (Nested) (type: int32)
            11
          ],
          // 5 (Complex) (type: repeated Nested)
          [
            // (Nested)
            [undefined, 22],
            // (Nested)
            [undefined, 33]
          ],
          // 6 (Complex) (Not used, so left empty)
          undefined,
          // 7 (Complex) (type: repeated string)
          [
            'field7_str1',
            'field7_str2',
          ],
          // 8 (Complex) (Not used, so left empty)
          undefined,
          // 9 (Complex) (type: optional bool)
          1,
          // 10 (Complex) (type: optional double)
          undefined,
        ],
      ],
    )

    this.run_tests(
      package_pb.Package,
      "package_tests",
      [
        [
          "react-box",
          "0.1.0",
          false,
          [
            ["key1", "value1"],
            ["key2", "value2"],
          ],
        ]
      ],
    )
  }

  create_accordion = (summary, tests) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <p> {summary} </p>
        </AccordionSummary>
        <AccordionDetails>
          {
            tests.map((test, index) => (
              <Grid item xs={12} key={index} sx={{ border: 1 }}>
                  <p>
                    {"payload: " + JSON.stringify(test.payload)}
                  </p>
                  <p>
                    {"message: " + JSON.stringify(test.message)}
                  </p>
                  <p>
                    {"object: " + JSON.stringify(test.object)}
                  </p>
                  <p>
                    {"serialized: " + JSON.stringify(test.serialized)}
                  </p>
                  <p>
                    {"message2: " + JSON.stringify(test.message2)}
                  </p>
                  <p>
                    {"object2: " + JSON.stringify(test.object2)}
                  </p>
              </Grid>
            ))
          }
        </AccordionDetails>
      </Accordion>
    )
  }

  render = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {
            this.create_accordion("AwesomeMessage", this.state.awesome_tests)
          }
          {
            this.create_accordion("Complex", this.state.complex_tests)
          }
          {
            this.create_accordion("Package", this.state.package_tests)
          }
        </Grid>
      </Grid>
    )
  }
}

export default DemoProtobufGoogle
