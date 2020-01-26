import React, { PureComponent } from 'react'
import * as Animatable from 'react-native-animatable'
import { TouchableOpacity, Platform, StyleSheet } from 'react-native'

import Close from '../assets/images/close.png'

export default class CloseButton extends PureComponent {
  constructor(props) {
    super(props)
  }

  onOpenPage = async () => {
    await this.refs.close.bounceOut(300)
    if (this.props.onOpenPage) this.props.onOpenPage()
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.button}
        onPress={this.onOpenPage.bind(this)}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      >
        <Animatable.Image ref={'close'} delay={500} animation={'bounceIn'} source={Close} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: '1.5%',
    marginLeft: Platform.OS === 'ios' ? '5%' : '1.5%',
    position: 'absolute',
  },
})
