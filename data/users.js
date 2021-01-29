import bcrypt from 'bcryptjs';

const users = [
    {
        fullname: 'Bobby Bobinson',
        password: bcrypt.hashSync('123456', 10),
        username: 'bBobinson',
        email: 'bBobinson@mail.com',
        isAdmin: true
    },
    {
        fullname: 'Robby Robinson',
        password: bcrypt.hashSync('654321', 10),
        username: 'rRobinson',
        email: 'rRobinson@mail.com',
        isAdmin: false
    },
    {
        fullname: 'Bob',
        password: bcrypt.hashSync('12345678', 10),
        username: 'Bob',
        email: 'bob@mail.com',
        isAdmin: false
    },
]

export default users;