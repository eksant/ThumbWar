import React, { PureComponent } from 'react'
import { StyleSheet, View, ScrollView, Button, TextInput, Alert } from 'react-native'

import { Heading } from '../../components'

export default class PageJoinRoom extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { room: null }
  }

  onChangeRoom = room => {
    this.setState({ room })
  }

  onJoinRoom = async () => {
    const { room } = this.state
    if (!room) return Alert.alert('Invalid', 'Please input Your room ID')
    this.props.onJoinRoom(room)
  }

  render() {
    return (
      <View style={styles.linearGradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headingContainer}>
            <Heading animation="flipInY" key="JOIN ROOM" ref="JOIN ROOM" value="JOIN ROOM" />
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="#FFF"
              placeholder="Room ID..."
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={this.onChangeRoom.bind(this)}
            />
          </View>

          <View style={styles.formContainer}>
            <Button onPress={this.onJoinRoom.bind(this)} title="Join Room" />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    marginTop: '2.5%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '2.25%',
  },
  formContainer: {
    width: '50%',
    marginTop: '2.5%',
    flexDirection: 'row',
    paddingLeft: '1.25%',
    paddingRight: '1.25%',
    marginBottom: '1.25%',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  input: {
    fontSize: 30,
    color: '#FFF',
    width: '100%',
    fontFamily: 'neuropol',
  },
  buttonContainer: {
    width: '100%',
    marginTop: '1.5%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1.25%',
  },
})
