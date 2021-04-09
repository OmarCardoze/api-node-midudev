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


        test('creation fails with proper status and messaje if username is already taken', async () => {

        const usersAtStart = await getUsers()

        const newUser = {
            username: 'devflix',
            name: 'Occzmar',
            password: '231zc23'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error.message).toContain('expected `username` to be unique')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        
    })

    afterAll(() => {
        server.close()
        moongose.connection.close()
    })
})