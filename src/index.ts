import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swagger/swagger-output.json";
import { errorMiddleware } from "./middlewares/error-middleware";
import { routerV1 } from "./routes/v1";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,  // If you are sending cookies
}));

app.use('/uploadImage', express.static('uploadImage'));  // Consider using an external service for this in production
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
    }
}));
app.use("/api/v1", routerV1);
app.use(errorMiddleware);

// Do NOT call `app.listen()` here
export default app;
