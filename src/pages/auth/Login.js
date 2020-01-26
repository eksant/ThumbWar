import React, { PureComponent } from 'react'
import { StyleSheet, Platform, View, ScrollView, Button, TextInput, Alert } from 'react-native'

import { Heading } from '../../components'

export default class PageLogin extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { username: null }
  }

  onChangeUsername = username => {
    this.setState({ username })
  }

  onLogin = async () => {
    const { username } = this.state
    if (!username) return Alert.alert('Invalid', 'Please input Your username')
    this.props.onLogin(username)
  }

  render() {
    return (
      <View style={styles.linearGradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headingContainer}>
            <Heading animation="flipInY" key="LOGIN" ref="LOGIN" value="LOGIN" />
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="#FFF"
              placeholder="Username..."
              placeholderTextColor="grey"
              autoCapitalize="none"
              onChangeText={this.onChangeUsername.bind(this)}
            />
          </View>

          <View style={styles.formContainer}>
            <Button style={styles.button} onPress={this.onLogin.bind(this)} title="Log in" />
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
    marginLeft: Platform.OS === 'ios' ? '5%' : 0,
  },
  input: {
    fontSize: 25,
    color: '#FFF',
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? 'Thonburi' : 'neuropol',
  },
  button: {
    fontSize: 25,
    color: '#FFF',
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
