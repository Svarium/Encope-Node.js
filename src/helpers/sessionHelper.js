// helpers/sessionHelper.js
module.exports = {
    createSession: (req, user) => {
        req.session.userLogin = {
            id: user.id,
            name: user.name,
            rol: user.rolId,
            icon: user.icon,
            socialId: user.socialId,
            destinoId: user.destinoId || null,
        };
    }
};
