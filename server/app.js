const express = require("express");
const app = express();
const port = 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

