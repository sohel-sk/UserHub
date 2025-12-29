import app = require("./app");
import config = require("./config/config");

app.listen(config.PORT, () => { 
    console.log(`Server is running on port ${config.PORT} in ${config.nodeEnv} mode.`);
});

export = app;