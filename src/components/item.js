import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import EStyleSheet from 'react-native-extended-stylesheet'

export default class Item extends PureComponent {
  constructor(props) {
    super(props)
  }

  fadeInLeft = duration => {
    return this.refs.item.fadeInLeft(duration)
  }

  fadeOutLeft = duration => {
    return this.refs.item.fadeOutLeft(duration)
  }

  fadeInRight = duration => {
    return this.refs.item.fadeInRight(duration)
  }

  fadeOutRight = duration => {
    return this.refs.item.fadeOutRight(duration)
  }

  fadeInUp = duration => {
    return this.refs.item.fadeInUp(duration)
  }

  fadeOutUp = duration => {
    return this.refs.item.fadeOutUp(duration)
  }

  zoomInDown = duration => {
    return this.refs.item.zoomInDown(duration)
  }

  zoomOutDown = duration => {
    return this.refs.item.zoomOutDown(duration)
  }

  render() {
    const { onOpenPage, delay, animation, value, fontSize, fontColor, fontFamily, disabled = false } = this.props

    return (
      <TouchableOpacity activeOpacity={disabled ? 1 : 0.7} onPress={onOpenPage}>
        <Animatable.Text
          delay={delay}
          animation={animation}
          style={[
            styles.itemText,
            fontSize ? { fontSize: fontSize } : null,
            fontColor ? { color: fontColor } : null,
            fontFamily ? { fontFamily: fontFamily } : null,
          ]}
          ref={'item'}
        >
          {value}
        </Animatable.Text>
      </TouchableOpacity>
    )
  }
}

const styles = EStyleSheet.create({
  $fontHeight: 35,
  $lineHeight: 40,
  itemText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'junebug',
    fontSize: '$fontHeight',
    lineHeight: '$lineHeight',
    backgroundColor: 'transparent',
  },
})
