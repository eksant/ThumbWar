import React, { PureComponent } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { View, Modal } from 'react-native'

import { PageMenu } from './pages'
import { CloseButton } from './components'

EStyleSheet.build()
console.disableYellowBox = true

export default class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { pageVisible: false, page: null, isPlaying: false }
  }

  mountPlay = page => {
    this.setState({ pageVisible: true, page, isPlaying: true })
  }

  mountPage = page => {
    this.setState({ pageVisible: true, page })
  }

  unMountPage = () => {
    this.setState({ pageVisible: false, page: null })
  }

  render() {
    const { pageVisible, page, isPlaying } = this.state

    return (
      <View style={{ flex: 1 }}>
        <PageMenu
          pageVisible={pageVisible}
          onPlay={page => this.mountPlay(page)}
          onClosePage={_ => this.unMountPage()}
          onOpenPage={page => this.mountPage(page)}
        />

        <Modal
          animationType="slide"
          supportedOrientations={['portrait', 'landscape']}
          transparent={false}
          visible={pageVisible}
          onRequestClose={_ => {}}
        >
          {page}
          {!isPlaying && <CloseButton onOpenPage={this.unMountPage.bind(this)} />}
        </Modal>
      </View>
    )
  }
}
