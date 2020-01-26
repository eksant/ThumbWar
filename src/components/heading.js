import React, { PureComponent } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import * as Animatable from 'react-native-animatable'
import { Text } from 'react-native'

export default class Heading extends PureComponent {
  constructor(props) {
    super(props)
  }

  fadeInLeft = duration => {
    return this.refs.heading.fadeInLeft(duration)
  }

  fadeOutLeft = duration => {
    return this.refs.heading.fadeOutLeft(duration)
  }

  fadeInRight = duration => {
    return this.refs.heading.fadeInRight(duration)
  }

  fadeOutRight = duration => {
    return this.refs.heading.fadeOutRight(duration)
  }

  flipInY = duration => {
    return this.refs.heading.flipInY(duration)
  }

  flipOutY = duration => {
    return this.refs.heading.flipOutY(duration)
  }

  render() {
    const { animation, value } = this.props

    return (
      <Animatable.View ref={'heading'} animation={animation} style={styles.container}>
        <Text style={styles.textHeading}>
          {value
            .substring(value.indexOf('.') + 1, value.length)
            .trim()
            .toUpperCase()}
        </Text>
      </Animatable.View>
    )
  }
}

const styles = EStyleSheet.create({
  $letterSpacingWidth: 10,
  container: {
    borderColor: '#FFF',
    borderBottomWidth: 2,
  },
  textHeading: {
    color: '#FFF',
    fontFamily: 'junebug',
    fontSize: 30,
    lineHeight: 35,
    backgroundColor: 'transparent',
    letterSpacing: '$letterSpacingWidth',
  },
})
