'user strict';
var User = require('./Users')

//sign in 
User.login = async (user, res, req) => {
    if (user.email && user.password) {
        await User.query()
            .where('email', user.email)
            .where('password', user.password)
            .then(userData => {
                var _user = userData[0];
                if (userData.length == 0) {
                    return res.render('login', { msg: "incorrect email or password" })
                } else {
                    req.session.isloggedin = true;
                    return res.status(200).render('profile',
                        { user: _user });
                    // return res.status(200).send({ success: true, id: userData.id, msg: "Success!", status: 200 });
                }
            })
            .catch(err => {
                console.log("Error is ", err.message);
                return res.status(500).render('login', { msg: err.message });
            });
    } else {
        res.status(401).render('login', { msg: "incorrect email or password" })
    }
    return res;
}

User.getUserByID = async (res, id, next) => {
    await User.query()
        .where('id', id)
        .then(user => {

            if (user.length == 0) {
                return res.render('login', { msg: "deleted account!", success: false });
            } else {
                return res.status(200).render(next, { user: user[0], msg: null })
            }
        })
        .catch(err => {
            console.log("Error is ", err.message);
            return res.json({ err: err.message, status: 500 })
        });
}

User.getUserByEmail = async (email) => {
    await User.query().where('email', email).then(
        (user, error) => {
            return user.length != 0 ? user[0] : false;
        }
    ).catch(err => { console.log(err) });
}

//sign up 
User.create = async (newUser, res) => {
    await User.query().where('email', newUser.email).then(
        async (user, error) => {
            //email is already used 
            if (user.length != 0) {
                return res.status(409).render('signup', { msg: 'email is already used' })
            } else {
                await User.query().insert({
                    userName: newUser.userName,
                    password: newUser.password,
                    email: newUser.email
                });
                return res.status(200).render('signup', { msg: 'You are now Registerd' })
            }
        }
    ).catch(err => {
        console.log("Error is ", err.message);
        return res.json({ err: err.message, status: 500 })
    });
    return;
}

User.getAll = async (req, res) => {
    await User.query()
        .then(users => {
            return res.json({ users, status: 200 })
        })
        .catch(err => {
            console.log("Error is ", err.message);
            return res.send({ err: err.message, status: 500 })
        });
    return;
}


User.update = async (user, res) => {
    await User.query()
        .where('id', user.id)
        .patch({
            email: user.email,
            userName: user.userName,
            password: user.password,
        }).then(() => {
            return res.status(200).render('updateUserInfo', { user, msg: "data updated s!" });
        })
        .catch(err => {
            console.log("Error is ", err.message);
            return res.status(500).render('updateUserInfo', { user, msg: err.message });
        });
}

User.deleteUser = async function (id, res, req) {
    console.log('id');
    console.log(id);
    await User.query().deleteById(id).then(() => {
        req.session.isloggedin = false;
        req.session.userid = null;
        return res.status(200).render('login', { msg: 'deleted successfully' })
            .catch(err => {
                console.log("Error is ", err.message);
                return res.statue(500).send({ success: false, err: err.message })
            });
    }
    )

}


module.exports = User;