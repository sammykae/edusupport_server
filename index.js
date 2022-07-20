require("dotenv").config();
const config = require("./config/db"); //.prepDb();
const cors = require("cors");
const express = require("express");
const { errorHandler } = require("./MiddleWare");
const Sub = require("./sub/Sub");
const app = express();
var cron = require("node-cron");
const nodemailer = require("nodemailer");
const Admin = require("./models/AdminModel");
app.use(cors());

// BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/Home"));
app.use("/admin", require("./routes/AdminRoutes"));
app.use("/student", require("./routes/StudentRoutes"));
app.use("/gstudent", require("./routes/GStudentRoutes"));
app.use("/teacher", require("./routes/TeacherRoutes"));
app.use("/parent", require("./routes/ParentRoutes"));
app.use("/reset", require("./routes/ResetRoutes"));
app.use(errorHandler);

cron.schedule("0 0 0 * * *", async () => {
	const [sub, _] = await Sub.select();
	if (sub.length > 0) {
		for (let off of sub) {
			await Sub.update(off.admin_id);
		}
	}
});

cron.schedule("0 * * * * *", async () => {
	const [sub, _] = await Sub.selectQuizOnhold();
	if (sub.length > 0) {
		for (let off of sub) {
			await Sub.publish(off.quiz_id);
		}
	}
	const [subs, __] = await Sub.selectQuizPublish();
	if (subs.length > 0) {
		for (let off of subs) {
			await Sub.hold(off.quiz_id);
		}
	}
});

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "efosajoseph@gmail.com",
		pass: "qzugshzcqajizayu",
	},
});

cron.schedule("00 00 9 * * *", async () => {
	const [sub, _] = await Sub.selectDateDiff();
	if (sub.length > 0) {
		sub.map(async (a) => {
			if (a.expiry <= 5 && a.expiry > 0) {
				const [email, _] = await Admin.findById(a.admin_id);
				var mailOptions = {
					from: "efosajoseph@gmail.com",
					to: `${email[0].email}`,
					subject: "Edusupport Subscription Notice",
					html: `<h1>Notice!!</h1>
					<p>Your Subscription as detailed below will expire in <b>${a.expiry}</b> day(s)</p>
					<p>Plan: <b>${a.plan}</b></p>
					<p>Subscription Date: ${a.date_sub}</p>
					<p>Expiry Date: ${a.date_end}</p>`,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log("Email sent: " + info.response);
					}
				});
			}
		});
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
