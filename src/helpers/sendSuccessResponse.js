module.exports = (res,{ data, ...props} = {} ) => {
    return res.status(200).json({ok:true, data, ...props})
}