import React, { PureComponent } from 'react'
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'

import { Heading } from '../../components'

export default class PageRegister extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.linearGradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headingContainer}>
            <Heading animation="flipInY" key="REGISTER" ref="REGISTER" value="REGISTER" />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: 'blue',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: '2.5%',
    marginBottom: '2.25%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
})
