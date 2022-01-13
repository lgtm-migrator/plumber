import { Probot, Context } from 'probot';

import { plumberPullEvent } from './services/common.service';
import { onSynchronize } from './services/rename.pull.service';

export = (app: Probot) => {
  /*
   *  */
  app.on(plumberPullEvent.init, logIt);

  /*
   * Title change */
  app.on(plumberPullEvent.edited, onSynchronize.bind(null, app));

  /*
   *  */
  app.on(plumberPullEvent.labels, logIt);

  /*
   *  */
  app.on(plumberPullEvent.reviews, logIt);

  /*
   *  */
  app.on(plumberPullEvent.checksInProgress, logIt);

  /*
   *  */
  app.on(plumberPullEvent.checksCompleted, logIt);

  /* Log errors */
  app.onError(async error => {
    app.log.error(error);
  });

  async function logIt(context: Context) {
    const { payload }: any = context;
    console.log('-------------------------\n', payload);
  }
};
