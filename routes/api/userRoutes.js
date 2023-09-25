const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  logUserIn,
  isValidToken,
  addGameToCollection,
  addGamesToCollection,
  removeGameFromCollection,

} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/login').post(logUserIn)

router.route('/isValidToken').get(isValidToken)

router.route('/getUser/bggcollection/:userId').post(addGamesToCollection)

router.route('/getUser/:userId').get(getSingleUser);

router.route('/getUser/edit/:userId').put(updateUser).delete(deleteUser);

router.route('/getUser/collection/:userId').post(addGameToCollection).delete(removeGameFromCollection);



module.exports = router;