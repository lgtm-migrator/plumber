import { Probot } from "probot";

import { plumberEvent } from "./services/common.service";
import { checkPull } from './services/check-pull.service';

export = (app: Probot) => {
    app.on(plumberEvent.pullrequestInit, checkPull);
    // app.on(plumberEvent.pullrequestLabel, renamePullrequest);

    /* Log errors */
    app.onError(async (error) => {
        app.log.error(error);
    });
};
