const bcrypt = require('bcrypt')
const User = require('../model/User')
const { api, getUsers } = require('./helpers')
const moongose = require('mongoose')
const { server } = require('../index')

describe('creating new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({ username: 'devflix', passwordHash})

        await user.save()
    })

    test('work as expected creating a fresh username', async ()=> {

        const usersAtStart = await getUsers()

        const newUser = {
            username: 'OmarCa',
            name: 'Omar',
            password: '23123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        
        const usersAtEnd = await getUsers()
        
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })

    afterAll(() => {
        server.close()
        moongose.connection.close()
    })
})