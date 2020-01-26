import React, { PureComponent } from 'react'
import { StyleSheet, View, Modal, Text } from 'react-native'

export default class MessageInfo extends PureComponent {
  render() {
    const { title, message, visible = false } = this.props

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={_ => {}}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.65,
    width: '100%',
    height: '100%',
    padding: '20%',
    backgroundColor: '#566573',
    justifyContent: 'flex-start',
  },
  content: {
    padding: 10,
    height: '60%',
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  headerText: {
    fontSize: 25,
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: 'junebug',
    backgroundColor: 'transparent',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: '2%',
    textAlign: 'center',
    fontFamily: 'junebug',
    backgroundColor: 'transparent',
  },
})
