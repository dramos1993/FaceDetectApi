const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function (err, hash) {
    //    console.log(hash);
    // Store hash in your password DB.
    //});

    if (!email || !name || !password) {
        res.status(400).json('Incorrect form submission')

    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(logInEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: logInEmail[0].email,
                        name: name,
                        joined: new Date()
                    })

                    .then(user => (
                        res.json(user[0])
                    ))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))
}




module.exports = {
    handleRegister: handleRegister
}

// const handleRegister = (req, res, db, bcrypt) => {
//     const { email, name, password } = req.body;
//     if (!email || !name || !password) {
//         return res.status(400).json('incorrect form submission');
//     }
//     const hash = bcrypt.hashSync(password);
//     db.transaction(trx => {
//         trx.insert({
//             hash: hash,
//             email: email
//         })
//             .into('login')
//             .returning('email')
//             .then(loginEmail => {
//                 return trx('users')
//                     .returning('*')
//                     .insert({
//                         // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
//                         // loginEmail[0] --> this used to return the email
//                         // TO
//                         // loginEmail[0].email --> this now returns the email
//                         email: loginEmail[0].email,
//                         name: name,
//                         joined: new Date()
//                     })
//                     .then(user => {
//                         res.json(user[0]);
//                     })
//             })
//             .then(trx.commit)
//             .catch(trx.rollback)
//     })
//         .catch(err => res.status(400).json('unable to register'))
// }

// module.exports = {
//     handleRegister: handleRegister
// };
