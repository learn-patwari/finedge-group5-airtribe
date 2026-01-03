const express = require('express');

const app = express();
const userRouter = require('./src/routes/userRoute');
const responseMiddleware = require('./src/middlewares/responseMiddleware');
const globalErrorHandlerMiddleware = require('./src/middlewares/globalErrorHandlerMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseMiddleware);

app.get('/health', (req, res) => {
	res.send('Up and Running');
});

app.use('/api/v1/users',userRouter);

app.use(globalErrorHandlerMiddleware);

module.exports = app;

// Allow `node app.js` to boot the server as well.
if (require.main === module) {
	require('./server');
}
