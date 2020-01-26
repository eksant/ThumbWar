import React, { PureComponent } from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import * as Animatable from 'react-native-animatable'
import EStyleSheet from 'react-native-extended-stylesheet'

import Back from '../assets/images/back.png'

export default class BackButton extends PureComponent {
  constructor(props) {
    super(props)
  }

  fadeInLeft = duration => {
    return this.refs.back.fadeInLeft(duration)
  }

  fadeOutLeft = duration => {
    return this.refs.back.fadeOutLeft(duration)
  }

  fadeInRight = duration => {
    return this.refs.back.fadeInRight(duration)
  }

  fadeOutRight = duration => {
    return this.refs.back.fadeOutRight(duration)
  }

  onPressIn = () => {
    this.refs.back.transitionTo({
      marginLeft: -40,
      marginRight: 40,
    })
  }

  onPressOut = () => {
    this.refs.back.transitionTo({
      marginLeft: -20,
      marginRight: 20,
    })
  }

  render() {
    const { onPress, animation } = this.props

    return (
      <TouchableOpacity
        key={'back'}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      >
        <Animatable.Image ref={'back'} animation={animation} style={styles.container} source={Back} />
      </TouchableOpacity>
    )
  }
}

const styles = EStyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: Platform.OS === 'ios' ? -20 : null,
  },
})
