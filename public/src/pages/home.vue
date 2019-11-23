<template lang="pug">
  q-page
    h3 Data Received
    div
      strong State:
      |  {{ this.response.state }}
    div
      strong Message:
      pre {{ this.response.message }}
    q-btn-toggle(
      v-model="pattern"
      toggle-color="primary"
      :options="patterns"
      @input="setPattern"
    )
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      response: {
        message: 'Any response from the websocket will appear here',
        state: 'error'
      },
      socket: '',
      pattern: '',
      patterns: [
        { label: 'Rainbow', value: 'rainbow' },
        { label: 'Strip', value: 'strip' }
      ]
    }
  },
  timers: {
    keepSocketAlive: { time: 1000 * 10, autostart: true, repeat: true }
  },
  methods: {
    setOutput (state, message) {
      this.response = {
        state,
        message
      }
    },
    setPattern (pattern) {
      console.log('pattern', pattern)
      this.sendMessage('command', { command: 'setPattern', value: pattern })
    },
    sendMessage (type, data) {
      this.socket.send(JSON.stringify({ timestamp: new Date(), type, data }))
    },
    parse (string) {
      try {
        const parsed = JSON.parse(string)
        return parsed
      } catch (e) {
        return string
      }
    },
    parseCommand (command) {
      if (command.command === 'setPattern') this.pattern = command.value
    },
    initSocket () {
      this.socket = new WebSocket(`ws://${window.location.hostname}:8041/`)

      this.socket.onopen = event => {
        console.info('WebSocket Opened!')
        this.sendMessage('message', { message: 'ready', type: 'info' })
      }

      this.socket.onerror = event => {
        console.error('Socket Error:', event)
        this.setOutput('error', this.parse(event))
      }

      this.socket.onmessage = event => {
        let response = this.parse(event.data)
        if (response.data) {
          console.info('message:', response)
          if (response.type === 'command') {
            console.log('COMMAND RECEIVED:', response.data.command, response.data.value)
            this.parseCommand(response.data)
          }
          this.setOutput('success', this.parse(response))
        } else {
          this.setOutput('warn', 'Data was not in a valid format!')
          console.error('Received data I do not recognise!', event)
        }
      }

      this.socket.onclose = event => {
        console.warn('Socket Closed:', event)
        this.setOutput('warn', this.parse(event))
      }
    },
    keepSocketAlive () {
      // console.log('SOCKET:', this.socket)
      if (this.socket.readyState !== 1) {
        console.warn('SOCKET DIED... RECONNECTING')
        this.socket.close()
        this.socket = ''
        this.initSocket()
      }
    }
  },
  mounted () {
    this.initSocket()
  },
  beforeDestroy () {
    this.socket.close()
  }
}
</script>
