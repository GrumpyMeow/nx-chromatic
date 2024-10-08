import { ExecutorContext, logger, parseTargetString, PromiseExecutor, readTargetOptions } from '@nx/devkit';
import { ChromaticExecutorSchema } from './schema';
import { Logger as ChromaticLogger, Options as ChromaticOptions, run as ChromaticRun } from 'chromatic/node';

function getBuildTargetOutputDir(options: ChromaticExecutorSchema, context: ExecutorContext): string {
  let buildOptions;
  try {
    const target = parseTargetString(`${context.projectName}:${options.buildTarget}`, context.projectGraph);
    buildOptions = readTargetOptions(target, context);
  } catch {
    throw new Error(`Invalid buildTarget: ${options.buildTarget}`);
  }

  const outputDir = buildOptions.outputDir as string;
  if (!outputDir) {
    throw new Error(
      `Unable to get the outputDir from buildTarget ${options.buildTarget}. Make sure ${options.buildTarget} has an outputDir property`
    );
  }

  return outputDir;
}


const runExecutor: PromiseExecutor<ChromaticExecutorSchema> = async (
  options, context: ExecutorContext
) => {
  const outputDir = getBuildTargetOutputDir(options, context);

  try {    

    const chromaticOptions: ChromaticOptions = {} as ChromaticOptions;
    
    chromaticOptions.storybookBuildDir = outputDir;
    chromaticOptions.skipUpdateCheck = true;

    if (options.onlyChanged != '') {
      chromaticOptions.onlyChanged = options.onlyChanged;
    }

    if (options.exitZeroOnChanges != '') {
      chromaticOptions.exitZeroOnChanges = options.exitZeroOnChanges;
    }

    if (options.exitOnceUploaded != '') {
      chromaticOptions.exitOnceUploaded = options.exitOnceUploaded;
    }

    if (options.autoAcceptChanges != '') {
      chromaticOptions.autoAcceptChanges = options.autoAcceptChanges;
    }

    chromaticOptions.allowConsoleErrors = options.allowConsoleErrors;
    chromaticOptions.projectToken = options.token;
    chromaticOptions.forceRebuild = options.forceRebuild;
    chromaticOptions.zip = options.zip;
    chromaticOptions.interactive = !options.noInteractive;
    
    const chromaticLogger: ChromaticLogger = {
      debug: () => {
        return;
      },
      warn: logger.warn,
      error: logger.error,
      info: logger.info,
      file: () => undefined,
      queue: () => {
        return;
      },
      flush: () => {
        return;
      },
      log: logger.log,
      setLevel: () => {
        return;
      },
      setInteractive: () => {
        return;
      },
      setLogFile: () => {
        return;
      },
      getLevel: (): 'silent' | 'error' | 'debug' | 'warn' | 'info' => {
        return 'warn';
      }
    };

    chromaticOptions.log = chromaticLogger;

    const result = await ChromaticRun({ options: chromaticOptions });

    if (
      (result.changeCount != 0 || result.errorCount != 0 || result.interactionTestFailuresCount != 0) &&
      result.url &&
      process.env['CI']
    ) {
      logger.error(`Chromatic result for "${context.projectName}": ${result.url}`);
    }
    if (result.code != 0) {
      return { success: false };
    }
  } catch (e) {
    logger.error(e);
    return { success: false };
  }

  return {
    success: true,
  };
};

export default runExecutor;
