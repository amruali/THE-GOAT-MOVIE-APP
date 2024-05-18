const userRepo = require('../DBs/postgres/userRepo')

module.exports = class {


    static getUserProfileInfo = async (request, h) => {

        try {
            
            const user_id = request.params.user_id;

            // validate in interger
            if (!(/^[0-9]+$/.test(user_id))) {
                return h.response({ error: 'Invalid UserID' }).code(400);
            }

            return await userRepo.getUserProfileInfo(user_id)


        } catch (err) {
            
            console.log(err)

            return h.response({ error: 'Internal Server Error' }).code(500);
        }
    }


}