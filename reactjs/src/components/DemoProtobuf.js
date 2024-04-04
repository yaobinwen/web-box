// 3rd-party
import Accordion from '@mui/material/Accordion'
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid'
import React from 'react'

// Ours
import awesome_pbjs from '../awesome_pbjs'
import demo_protobuf_pbjs from '../demo_protobuf_pbjs'
import hardware_pbjs from '../hardware_pbjs'
import hardware_json_file from '../data/hardware.json'
import package_json_file from '../../package.json'

class DemoProtobuf extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      awesome_tests: [],
      hardware_tests: [],
      package_tests: [],
      protobuf_tests: [],
    }
  }

  run_tests = (MessageType, state_field, payloads) => {
    let tests = []
    for (let payload of payloads) {
      let err_msg = MessageType.verify(payload)
      let message = null
      let msg_obj = null
      let encoded = null
      let decoded = null
      if (!err_msg) {
        message = MessageType.create(payload)
        msg_obj = MessageType.toObject(message)
        encoded = MessageType.encode(message).finish()
        decoded = MessageType.decode(encoded)
      }
      tests.push({
        "payload": payload,
        "err_msg": err_msg,
        "message": message,
        "msg_obj": msg_obj,
        "encoded": encoded,
        "decoded": decoded,
      })
    }

    let state = {}
    state[state_field] = tests
    this.setState(state)
  }

  componentDidMount = () => {
    this.run_tests(
      awesome_pbjs.awesomepackage.AwesomeMessage,
      "awesome_tests",
      [
        undefined,
        null,
        "invalid (not an object)",
        0,
        {},
        {
          awesomeField: 0,
        },
        {
          content: {},
        },
        {
          awesomeField: "good",
        },
        {
          awesomeField: "title",
          content: "content",
        },
        {
          awesomeField: "good",
          hello: 10,
        },
      ]
    )

    this.run_tests(
      hardware_pbjs.hardware_config.v0.Hardware,
      "hardware_tests",
      [
        undefined,
        null,
        "",
        0,
        {},
        {
          "part3": [
            {
              "m": {
                "name": "part3_m",
                "ip": "10.8.0.2"
              }
            },
            {
              "name": "part3_n",
              "ip": "10.8.0.3"
            },
          ]
        },
        hardware_json_file
      ],
    )

    this.run_tests(
      demo_protobuf_pbjs.demo_protobuf.Package,
      "package_tests",
      [
        undefined,
        null,
        "invalid (not an object)",
        0,
        // OK to use an empty object.
        {},
        // OK to use a partial object.
        {
          dependencies: {
            "dep1": "verion1",
            "dep2": "verion2",
          },
        },
        // The fields that are not defined in the message are ignored.
        {
          name: "test",
          scripts: {
            "name1": "command1",
            "name2": "command2",
          },
          field3: "value3",
          field4: "value4",
        },
        package_json_file,
      ],
    )

    this.run_tests(
      demo_protobuf_pbjs.demo_protobuf.MainMessage,
      "protobuf_tests",
      [
        {},
        {
          map1: {
            one: 1,
            two: 2,
          },
          mapMsg: {
            map2: {
              three: 3,
              four: 4,
            },
          }
        }
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
                    {"err_msg: " + JSON.stringify(test.err_msg)}
                  </p>
                  <p>
                    {"message: " + JSON.stringify(test.message)}
                  </p>
                  <p>
                    {"msg_obj: " + JSON.stringify(test.msg_obj)}
                  </p>
                  <p>
                    {"encoded: " + JSON.stringify(test.encoded)}
                  </p>
                  <p>
                    {"decoded: " + JSON.stringify(test.decoded)}
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
            this.create_accordion("demo_protobuf.Package", this.state.package_tests)
          }
          {
            this.create_accordion("demo_protobuf.MainMessage", this.state.protobuf_tests)
          }
          {
            this.create_accordion("hardware_config.v0.Hardware", this.state.hardware_tests)
          }
        </Grid>
      </Grid>
    )
  }
}

export default DemoProtobuf
