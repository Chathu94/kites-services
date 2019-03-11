import Joi from "joi";
import * as Decorators from "systemblocks/decorator";
import * as Blocks from "systemblocks/class";

const Method = Decorators.Method;
const Secure = Decorators.Secure;

export default class LoginController extends Blocks.Controller {
  constructor() {
    super({ application: "auth" });
  }

  @Method({
    method: "PUT",
    parameters: {
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  })
  async create(req, res) {
    const { name, username, password } = req.body;
    console.log(name, username, password);
    const dbSave = req.startTimer('Save user object');
    const saved = await new _block.modals.User({
      name, username, password
    }).save();
    dbSave.endTimer();
    return Promise.resolve(new Blocks.Output(saved));
  }

  @Method({
    method: "POST",
    parameters: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  })
  async login(req, res) {
    const { username, password } = req.body;
    const dbGet = req.startTimer('Get user from db');
    // let session  = await req.getSqlSession();
    // const user = await Blocks.MySQL.execute({ sql: 'INSERT INTO test(bill, transaction) VALUES(1, 20)', connection: session });
    let session = await req.getMongoSession();
    let user = await _block.modals.User.findOne({
      username, password
    }).session(session);
    dbGet.endTimer();
    if (!user) throw new Blocks.SBError('User not found.');
    const generateToken = req.startTimer('Generate token');
    const token = Blocks.Controller.generateToken({ _id: user._id });
    generateToken.endTimer();
    user.token = token;
    const dbSave = req.startTimer('Save user with token');
    user = await user.save();
    dbSave.endTimer();
    return Promise.resolve(new Blocks.Output(user));
  }

  @Secure()
  @Method({
    method: "GET"
  })
  async get(req, res) {
    const saved = await new _block.modals.User({
      name: "Test 2", username: "txt2", password: "Aa12"
    }).save({ session: req.session });
    console.log('saved', saved);
    throw new Error('Test');
    // _block.helpers.Audit.test();
    return Promise.resolve(new Blocks.Output(req.body));
  }
}
