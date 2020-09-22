const express = require('express');
const User = require('../models/User');
const router = new express.Router();
const sendError = require('../utils/sendError');
const auth = require('../middleware/auth');

router.route('/users')
    .post(
        async (req, res) => {
            const user = new User(req.body);

            try {
                await user.save();
                const token = await user.generateAuthToken();

                res.status(201).send({ user, token });
            } catch (e) {
                sendError(res, e);
            }
        })
    .get(
        async (req, res) => {
            try {
                const users = await User.find({});

                res.send({ data: users });
            } catch (e) {
                sendError(res, e);
            }
        });

router.route('/users/:id')
    .get(
        async (req, res) => {
            const _id = req.params.id;

            try {
                const user = await User.findById(_id);

                if (!user) {
                    return res.status(404).send();
                }

                res.send(user);
            } catch (e) {
                sendError(res, e);
            }
        })
    .patch(
        async (req, res) => {
            const updates = Object.keys(req.body);
            const allowedUpdates = [ 'name', 'email', 'password', 'age' ];
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

            if (!isValidOperation) {
                return res.status(400).send({ error: 'Invalid updates!' });
            }

            try {
                const user = await User.findById(req.params.id);

                if (!user) {
                    return res.status(404).send();
                }

                updates.forEach(update => user[update] = req.body[update]);

                await user.save();

                if (!user) {
                    return res.status(404).send();
                }

                res.send(user);
            } catch (e) {
                sendError(res, e);
            }
        })
    .delete(
        async (req, res) => {
            try {
                const user = await User.findByIdAndDelete(req.params.id);

                if (!user) {
                    return res.status(404).send();
                }

                res.send(200, { data: true });
            } catch (e) {
                sendError(res, e);
            }
        });

router.route('/users/login')
    .post(
        async (req, res) => {
            try {
                const user = await User.findByCredentials(req.body.email, req.body.password);

                const token = await user.generateAuthToken();

                res.send({ user, token });
            } catch (e) {
                sendError(res, e);
            }
        });

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(200, { data: req.user });
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/users/remove/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;