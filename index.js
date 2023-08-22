const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 5500;
const auth = require("./middleware/auth");

const register = require("./src/user/register");
const login = require("./src/user/login");

const registerAdmin = require("./src/admin/regisAdmin");
const loginAdmin = require("./src/admin/loginAdmin");
const user = require("./src/user/getuser");

const addPet = require("./src/pet/addPet");
const getPet = require("./src/pet/getPet");

const addEmployee = require("./src/employee/addEmployee");
const getEmployee = require("./src/employee/getEmployee");

const addMed = require("./src/medicine/addmed");
const getmed = require("./src/medicine/getmed");
const addcase = require("./src/case/case");
const getcase = require("./src/case/getcase");
const addOrder = require("./src/medOrder/addMedOder");
const getOrder = require("./src/medOrder/getOrder");

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept, x-access-token, x-refresg-token, _id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresg-token"
  );
  next();
});
app.listen(PORT, () => console.log(`server is running on ${PORT}`));

app.post("/register", async (req, res) => {
  register(req, res);
});

app.post("/login", async (req, res) => {
  login(req, res);
});

app.post("/registerAdmin", async (req, res) => {
  registerAdmin(req, res);
});

app.post("/loginAdmin", async (req, res) => {
  loginAdmin(req, res);
});

app.post("/addPet", auth, async (req, res) => {
  addPet(req, res);
});

app.post("/addEmployee", auth, async (req, res) => {
  addEmployee(req, res);
});

app.post("/addMed", auth, async (req, res) => {
  addMed(req, res);
});

app.post("/addCase", auth, async (req, res) => {
  addcase(req, res);
});

app.post("/addOrder", auth, async (req, res) => {
  addOrder(req, res);
});

app.get("/medicine", auth, async (req, res) => {
  getmed(req, res);
});

app.get("/user", auth, async (req, res) => {
  user(req, res);
});

app.get("/employee", auth, async (req, res) => {
  getEmployee(req, res);
});

app.get("/pet", auth, async (req, res) => {
  getPet(req, res);
});

app.get("/case", auth, async (req, res) => {
  getcase(req, res);
});

app.get("/order", auth, async (req, res) => {
  getOrder(req, res);
});
