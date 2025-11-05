import app from "./src/app.js"
import { config } from "./src/config/config.js";
import connectDataBase from "./src/db/db.js";

connectDataBase()

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});