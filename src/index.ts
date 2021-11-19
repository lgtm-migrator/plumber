import { Probot } from "probot";

import { plumberEvent, renamePullrequest } from "./services/common.service";

export = (app: Probot) => {
    app.on(plumberEvent.pullrequestInit, renamePullrequest);
    app.on(plumberEvent.pullrequestLabel, renamePullrequest);

    /* Log errors */
    app.onError(async (error) => {
        app.log.error(error);
    });
};
