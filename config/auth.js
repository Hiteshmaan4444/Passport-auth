module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash('error_msg', 'Your are not authenticated');
            res.redirect('/users/login');
        }
    }
}