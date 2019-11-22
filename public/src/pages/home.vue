<template lang="pug">
  q-page
    h3 Data Received
    div
      strong Type:
      |  {{ this.responseType }}
    div
      strong Message:
      pre {{ this.response }}
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      response: 'Any response from the websocket will appear here',
      responseType: 'error',
      socket: ''
    }
  },
  methods: {
    updateState (data) {
      console.log('data', data)
    },
    setOutput (type, message) {
      this.responseType = type
      this.response = message
    }
  },
  mounted () {
    this.socket = new WebSocket(`ws://${window.location.hostname}:8041/`)

    this.socket.onopen = event => {
      console.log('websocket opened', event)
      const json = JSON.stringify({ timestamp: new Date(), message: 'ready' })
      this.socket.send(json)
    }

    this.socket.onerror = event => {
      console.error('Socket Error:', event)
      this.setOutput('error', JSON.stringify(event, null, 2))
    }

    this.socket.onmessage = event => {
      let response = JSON.parse(event.data)
      if (response.data) {
        console.log(response)
        this.setOutput('success', JSON.stringify(response, null, 2))
      } else {
        this.setOutput('warn', 'Data was not in a valid format!')
        console.error('Received data I do not recognise!', event)
      }
    }

    this.socket.onclose = event => {
      console.log('Socket Closed:', event)
      this.setOutput('warn', JSON.stringify(event, null, 2))
    }
  },
  beforeDestroy () {
    this.socket.close()
  }
}
</script>
