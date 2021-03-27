const bcrypt = require('bcrypt')
const User = require('../model/User')

describe('creating new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({ username: 'devflix', passwordHash})

        await user.save()
    })

    test('work as expected creating a fresh username', async ()=> {
        const usersDB = await User.find({})
        const usersAtStart = usersDB.map(user, user.toJSON())

        const newUser = {
            username: 'OmarCa',
            name: 'Omar',
            password: '23123'
        }

        
    })
})