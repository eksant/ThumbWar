function randomId(length = 5) {
  let chars = 'abcdefghijklmnopqrstuvwxyz1234567890' //'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890'
  let pass = ''

  for (let x = 0; x < length; x++) {
    let i = Math.floor(Math.random() * chars.length)
    pass += chars.charAt(i)
  }

  return pass
}

export default { randomId }
