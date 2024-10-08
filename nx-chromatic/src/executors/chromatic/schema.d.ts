export interface ChromaticExecutorSchema {
    token: string;
    buildTarget: string;
    parameters: string;
    allowConsoleErrors: boolean;
    onlyChanged: string;
    exitZeroOnChanges: string;
    exitOnceUploaded: string;
    autoAcceptChanges: string;
    forceRebuild: boolean;
    zip: boolean;
    noInteractive: boolean;
    configFile: string;
  }
  