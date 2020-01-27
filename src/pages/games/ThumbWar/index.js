import React, { PureComponent } from 'react'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import { StyleSheet, TouchableWithoutFeedback, ImageBackground, View, Text, Alert, Image, Animated } from 'react-native'

const layers = [
  require('../../../assets/images/action-p1up-p2up.png'),
  require('../../../assets/images/action-p1down-p2up.png'),
  require('../../../assets/images/action-p1up-p2down.png'),
  require('../../../assets/images/action-p1hit.png'),
  require('../../../assets/images/action-p2hit.png'),
  require('../../../assets/images/action-p1winner.png'),
  require('../../../assets/images/action-p2winner.png'),
]

export default class PageThumbWar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      damage: 20,
      healthOne: 100,
      healthTwo: 100,
      hitTimeOne: null,
      hitTimeTwo: null,
      data: props.data,
      action: layers[0],
      channel: props.channel,
    }

    this.animOne = new Animated.Value(this.state.healthOne)
    this.animTwo = new Animated.Value(this.state.healthTwo)
  }

  componentDidMount() {
    const { pubnub, channel, data, onEndGame } = this.props

    pubnub.getMessage(channel, msg => {
      const { message } = msg
      const { damage, healthOne, healthTwo, hitTimeOne, hitTimeTwo } = this.state

      let decHealthOne = healthOne
      let decHealthTwo = healthTwo

      this.setState({
        action: layers[message.act],
        hitTimeOne: message.player === data.playerOne ? message.hitTime : hitTimeOne,
        hitTimeTwo: message.player === data.playerTwo ? message.hitTime : hitTimeTwo,
      })

      if (hitTimeOne && hitTimeTwo) {
        if (moment(hitTimeOne).isBefore(moment(hitTimeTwo))) {
          decHealthOne = decHealthOne - damage
          this.setState({ action: layers[4], healthOne: decHealthOne, hitTimeOne: null, hitTimeTwo: null })
          this.onChangeHealthOne(decHealthOne)
        } else if (moment(hitTimeTwo).isBefore(moment(hitTimeOne))) {
          decHealthTwo = decHealthTwo - damage
          this.setState({ action: layers[3], healthTwo: decHealthTwo, hitTimeOne: null, hitTimeTwo: null })
          this.onChangeHealthTwo(decHealthTwo)
        }
      }

      if (decHealthOne < 1) {
        this.setState({ action: layers[6] })
        Alert.alert('Congrat', `${data.playerTwo} WINNER`, [{ text: 'Exit Game', onPress: _ => onEndGame() }], { cancelable: false })
      } else if (decHealthTwo < 1) {
        this.setState({ action: layers[5] })
        Alert.alert('Congrat', `${data.playerOne} WINNER`, [{ text: 'Exit Game', onPress: _ => onEndGame() }], { cancelable: false })
      }
    })
  }

  onPlayerHitIn = () => {
    const { pubnub, channel, data } = this.props
    let act = 0

    if (data.username === data.playerOne) act = 1
    else if (data.username === data.playerTwo) act = 2

    pubnub.publish({ message: { hitTime: moment(), player: data.username, act }, channel })
  }

  onPlayerHitOut = () => {
    const { pubnub, channel, data } = this.props
    const act = 0

    pubnub.publish({ message: { hitTime: null, player: data.username, act }, channel })
  }

  onChangeHealthOne = healthValue => {
    this.animOne.addListener(({ value }) => {
      this.setState({ healthOne: parseInt(value, 10) })
    })
    Animated.timing(this.animOne, {
      toValue: healthValue,
      duration: 1000,
    }).start()
  }

  onChangeHealthTwo = healthValue => {
    this.animTwo.addListener(({ value }) => {
      this.setState({ healthTwo: parseInt(value, 10) })
    })
    Animated.timing(this.animTwo, {
      toValue: healthValue,
      duration: 1000,
    }).start()
  }

  render() {
    const { arena } = this.props
    const { data, action, channel, healthOne, healthTwo, hitTimeOne, hitTimeTwo } = this.state

    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={arena}>
          <View style={styles.header}>
            <View style={styles.headerPlayerOne}>
              <View style={styles.playerHealth}>
                <View style={[styles.containerHealth, { alignItems: 'flex-end' }]}>
                  <Animated.View
                    style={[styles.innerHealth, { backgroundColor: healthOne < 50 ? 'red' : 'green' }, { width: healthOne + '%' }]}
                  />
                  <Animated.Text style={styles.labelHealth}>{healthOne}</Animated.Text>
                </View>
              </View>
              <Text style={styles.playerText}>{data && data.playerOne}</Text>
            </View>
            <View style={styles.headerTitle}>
              <Text style={styles.titleText}>ROOM</Text>
              <Text style={styles.titleText}>{channel}</Text>
            </View>
            <View style={styles.headerPlayerTwo}>
              <View style={styles.playerHealth}>
                <View style={[styles.containerHealth, { alignItems: 'flex-start' }]}>
                  <Animated.View
                    style={[styles.innerHealth, { backgroundColor: healthTwo < 50 ? 'red' : 'green' }, { width: healthTwo + '%' }]}
                  />
                  <Animated.Text style={styles.labelHealth}>{healthTwo}</Animated.Text>
                </View>
              </View>
              <Text style={styles.playerText}>{data && data.playerTwo}</Text>
            </View>
          </View>

          <TouchableWithoutFeedback onPressIn={this.onPlayerHitIn} onPressOut={this.onPlayerHitOut}>
            <View style={styles.body}>
              <Image style={{ width: '100%', height: '100%' }} source={action} />

              <View style={styles.hit}>
                <View style={styles.hitPlayerOne}>
                  <Animatable.Text animation="bounceInUp" style={styles.hitText}>
                    {hitTimeOne && moment(hitTimeOne).format('ss:sss')}
                  </Animatable.Text>
                </View>
                <View style={styles.hitPlayerTwo}>
                  <Animatable.Text animation="bounceInUp" style={styles.hitText}>
                    {hitTimeTwo && moment(hitTimeTwo).format('ss:sss')}
                  </Animatable.Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: null,
    height: null,
    // opacity: 0.8,
  },
  header: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerPlayerOne: {
    width: '42%',
    alignItems: 'flex-end',
  },
  headerTitle: {
    padding: 5,
    width: '16%',
    textAlign: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    color: '#000',
    lineHeight: 25,
    textAlign: 'center',
    fontFamily: 'junebug',
    backgroundColor: 'transparent',
  },
  headerPlayerTwo: {
    width: '42%',
    alignItems: 'flex-start',
  },
  playerHealth: {
    width: '85%',
    height: '60%',
    paddingTop: '1%',
  },
  containerHealth: {
    flex: 1,
    height: 30,
    padding: 3,
    width: '100%',
    borderWidth: 3,
    borderRadius: 25,
    borderColor: '#FAA',
    justifyContent: 'center',
  },
  innerHealth: {
    height: 25,
    width: '100%',
    borderRadius: 15,
  },
  labelHealth: {
    zIndex: 1,
    fontSize: 23,
    color: 'black',
    alignSelf: 'center',
    position: 'absolute',
  },
  playerText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 20,
    paddingTop: '1%',
    fontFamily: 'junebug',
    backgroundColor: 'transparent',
  },
  hit: {
    height: '20%',
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'center',
  },
  hitText: {
    fontSize: 25,
    color: '#FFF',
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: 'junebug',
    backgroundColor: 'transparent',
  },
  hitPlayerOne: {
    width: '50%',
    padding: '5%',
    alignItems: 'flex-start',
  },
  hitPlayerTwo: {
    width: '50%',
    padding: '5%',
    alignItems: 'flex-end',
  },
  body: {
    height: '100%',
  },
})
