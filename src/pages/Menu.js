import React, { PureComponent, Fragment } from 'react'
import PubNubReact from 'pubnub-react'
import { StyleSheet, StatusBar, View, ScrollView, Image, ImageBackground, Alert } from 'react-native'
import { GameEngine } from 'react-native-game-engine'

import { PageLogin, PageRegister } from './auth'
import { PageCreateRoom, PageJoinRoom } from './room'
import { GameThumbWar, GameDonkeyKong } from './games'
import { Item, SpawnParticles, Gravity, Wind, Sprinkles, Motion, DegenerateParticles, ParticleSystem, MessageInfo } from '../components'

import Logo from '../assets/images/logo-zoobc.png'
import User from '../assets/images/thumb-user.png'
import Background from '../assets/images/bg-menu.png'

const arenas = [require('../assets/images/arena-1.png'), require('../assets/images/arena-2.png')]

export default class PageMenu extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      bet: 0,
      balance: 10,
      roomId: null,
      username: null,
      playerOne: null,
      playerTwo: null,
      isPlaying: false,
      isRoomCreator: false,
      error: false,
      message: null,
    }

    this.pubnub = new PubNubReact({
      // publishKey: 'pub-c-a33b94f1-120d-4f0f-a1f2-4da89ee1af92',
      // subscribeKey: 'sub-c-a160fd12-3ce3-11ea-afe9-722fee0ed680',
      publishKey: 'pub-c-f3939185-6e95-4cf7-83c1-da78300eb95e',
      subscribeKey: 'sub-c-b49eb132-3dae-11ea-afe9-722fee0ed680',
      subscribeRequestTimeout: 60000,
      presenceTimeout: 120,
    })

    this.channel = null
    this.pubnub.init(this)
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: ['ThumbWar', this.channel] })
  }

  componentDidMount() {
    this.pubnub.subscribe({ channels: ['ThumbWar'], withPresence: true })
    this.pubnub.getStatus(status => {
      console.log('==STATUS=====>>>>', status)
      const { category, error } = status
      if (error && category === 'PNNetworkIssuesCategory') {
        this.setState({ error: true, message: `The Network Is Offline.\nThis Message Will Closed after Network Connected.` })
      } else {
        this.setState({ error: false, message: null })
      }
    })
    this.pubnub.getMessage('ThumbWar', msg => {
      console.log('==GET MESSAGE=====>>>>', msg)
      const { message } = msg
      if (message.isRoomCreator) {
        this.setState({ playerOne: message.username, bet: message.bet })
      } else if (message.notRoomCreator) {
        this.setState({ playerTwo: message.username, isPlaying: true })
        this.pubnub.unsubscribe({ channels: ['ThumbWar'] })
      }
      if (this.state.isPlaying) {
        this.props.onPlay(
          <GameThumbWar
            arena={arenas[0]}
            data={this.state}
            pubnub={this.pubnub}
            channel={this.channel}
            onEndGame={this.onEndGame.bind(this)}
          />
        )
      }
    })
  }

  onLogin = username => {
    if (username) {
      this.setState({ username })
      this.props.onClosePage()
    }
  }

  onLogout = () => {
    this.pubnub.unsubscribe({ channels: ['ThumbWar', this.channel] })
    this.setState({
      bet: 0,
      roomId: null,
      username: null,
      playerOne: null,
      playerTwo: null,
      isPlaying: false,
      isRoomCreator: false,
    })
  }

  onCreateRoom = (room, bet) => {
    const { username } = this.state

    if (room && username) {
      this.props.onClosePage()
      this.channel = room //`${room}-${util.randomId()}`
      this.pubnub.subscribe({ channels: [this.channel], withPresence: true })
      this.pubnub.publish({ message: { isRoomCreator: true, username, room: this.channel, bet }, channel: 'ThumbWar' })
      this.setState({ isRoomCreator: true, roomId: this.channel, bet })
      // Alert.alert('Share this room ID with your friend', `Room ID ${this.channel}\nBet Value ${bet}`, [{ text: 'Done' }], {
      //   cancelable: false,
      // })
    }
  }

  onJoinRoom = roomId => {
    const { username } = this.state

    if (roomId && username) {
      this.channel = roomId
      this.pubnub
        .hereNow({ channels: [this.channel] })
        .then(response => {
          const { totalOccupancy } = response

          if (totalOccupancy < 1) {
            Alert.alert('Room is empty', 'Room not found')
          } else if (totalOccupancy === 1) {
            this.props.onClosePage()
            this.pubnub.subscribe({ channels: [this.channel], withPresence: true })
            this.pubnub.publish({ message: { readyToPlay: true, notRoomCreator: true, username }, channel: 'ThumbWar' })
          } else Alert.alert('Room full', 'Please enter another room name')
        })
        .catch(error => console.error(error))
    }
  }

  onCloseRoom = () => {
    this.pubnub.unsubscribe({ channels: [this.channel] })
    this.pubnub.unsubscribeAll()
    this.pubnub.subscribe({ channels: ['ThumbWar'], withPresence: true })
    this.channel = null
    this.setState({
      bet: 0,
      roomId: null,
      playerOne: null,
      playerTwo: null,
      isPlaying: false,
      isRoomCreator: false,
    })
  }

  onEndGame = () => {
    this.props.onClosePage()
    this.onCloseRoom()
  }

  render() {
    const { pageVisible, onOpenPage } = this.props
    const { username, roomId, bet, balance, error, message } = this.state

    return (
      <View style={styles.linearGradient}>
        <ImageBackground style={styles.background} source={Background}>
          <GameEngine
            ref={'engine'}
            running={!pageVisible}
            systems={[SpawnParticles, Gravity, Wind, Sprinkles, Motion, DegenerateParticles]}
            entities={{ 'particle-system-01': { particles: [], renderer: ParticleSystem } }}
          >
            <StatusBar hidden={false} barStyle={'light-content'} />

            <ScrollView contentContainerStyle={styles.container}>
              <Image style={username ? styles.user : styles.logo} source={username ? User : Logo} />

              {username && (
                <Fragment>
                  <View style={[styles.containerCenter, { marginTop: -40 }]}>
                    <Item value={username} animation="zoomInDown" />
                  </View>
                  <View style={[styles.containerCenter, { marginTop: -10, marginBottom: -10 }]}>
                    <Item fontSize={15} fontColor="#000" value={`Balance ${balance}`} animation="fadeInUp" />
                  </View>
                  {roomId && bet && (
                    <View style={[styles.containerCenter, { marginTop: -10, marginBottom: -20 }]}>
                      <Item fontSize={15} fontColor="#000" value={`Room ID ${roomId} With Bet Value ${bet}`} animation="fadeInUp" />
                    </View>
                  )}
                  <View style={[styles.containerCenter, { marginBottom: 10 }]}>
                    <Item fontSize={15} fontColor="#FF5733" value="LOG OUT" animation="fadeInUp" onOpenPage={this.onLogout.bind(this)} />
                  </View>
                </Fragment>
              )}

              <View style={styles.containerSpace}>
                {!username ? (
                  <Fragment>
                    <Item
                      value="LOGIN"
                      delay={5 * 75}
                      animation="fadeInLeft"
                      onOpenPage={_ => onOpenPage(<PageLogin onLogin={this.onLogin.bind(this)} />)}
                    />
                    <Item value="REGISTER" animation="fadeInRight" delay={10 * 75} onOpenPage={_ => onOpenPage(<PageRegister />)} />
                  </Fragment>
                ) : roomId && bet ? (
                  <Fragment>
                    <Item fontSize={25} value="CLOSE ROOM" animation="fadeInLeft" onOpenPage={_ => this.onCloseRoom()} />
                    <Item fontSize={25} fontColor="grey" disabled={true} value="WAITING USER.." animation="fadeInRight" />
                  </Fragment>
                ) : (
                  <Fragment>
                    <Item
                      fontSize={25}
                      value="CREATE ROOM"
                      animation="fadeInLeft"
                      onOpenPage={_ => onOpenPage(<PageCreateRoom onCreateRoom={this.onCreateRoom.bind(this)} />)}
                    />
                    <Item
                      fontSize={25}
                      value="JOIN ROOM"
                      animation="fadeInRight"
                      onOpenPage={_ => onOpenPage(<PageJoinRoom onJoinRoom={this.onJoinRoom.bind(this)} />)}
                    />
                  </Fragment>
                )}
              </View>

              <View style={styles.containerCenter}>
                <Item
                  fontSize={15}
                  delay={20 * 75}
                  value="Bonus Game"
                  fontColor="#000"
                  animation="fadeInUp"
                  onOpenPage={_ => onOpenPage(<GameDonkeyKong />)}
                />
              </View>

              <MessageInfo visible={error} title="Network Issue !!" message={message} />
            </ScrollView>
          </GameEngine>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: '#618DF0',
  },
  background: {
    flex: 1,
    width: null,
    height: null,
    opacity: 0.85,
  },
  logo: {
    marginTop: '5%',
    marginBottom: '5%',
  },
  user: {
    marginTop: '5%',
    marginBottom: '5%',
    height: 100,
    width: 180,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  containerSpace: {
    flex: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerCenter: {
    flex: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headingContainer: {
    marginTop: '2.5%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2.25%',
  },
})
