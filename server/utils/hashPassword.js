import bcrypt from 'bcryptjs'

const plainPassword = 'admintest1234' // replace with your password
const saltRounds = 10

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) throw err
  console.log('Hashed password:', hash)
})
