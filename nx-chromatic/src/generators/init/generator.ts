import {
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  readNxJson,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
import { InitGeneratorSchema } from './schema';
import { forEachExecutorOptions } from '@nx/devkit/src/generators/executor-options-utils';

function addChromaticAddon(tree: Tree) {
  // Add temporary workaround for running build-script from Chromatic Storybook add-on
  const filenamePackageJson = joinPathFragments('package.json');
  const packageJson = tree.read(filenamePackageJson);
  const packageJsonContent = JSON.parse(packageJson.toString());
  if (!packageJsonContent['scripts']['build-storybook']) {
    packageJsonContent['scripts']['build-storybook'] = "nx run $NX_TASK_TARGET_PROJECT:build-storybook";
  }
  
  tree.write(filenamePackageJson,JSON.stringify(packageJsonContent));

    forEachExecutorOptions(
      tree,
      '@storybook/angular:build-storybook',
      (_, projectName, targetName) => {
        const project = readProjectConfiguration(tree, projectName);

        const storybookConfigDir = project.targets?.['build-storybook']?.options['configDir'] ?? joinPathFragments(project.sourceRoot,'.storybook');

        const filenameConfig = joinPathFragments(
          storybookConfigDir,
          'chromatic.config.json');

        if (!tree.exists(filenameConfig)) {
          tree.write(filenameConfig,'{}');
        }

        const filename = joinPathFragments(
          storybookConfigDir,
          'main.ts');
        const previewTs = tree.read(filename);

        let content = previewTs.toString();
        if (!content.includes('@chromatic-com/storybook')) {
          content = content.replace('\'@storybook/addon-essentials\'', `'@storybook/addon-essentials', {name:'@chromatic-com/storybook',options:{configFile:'${filenameConfig}'} }`)

          tree.write(filename,content);
        }
        
      }
    );
}

function addCacheableOperation(tree: Tree) {
  const nxJson = readNxJson(tree);
  const cacheableOperations: string[] | null =
    nxJson.tasksRunnerOptions?.default?.options?.cacheableOperations;

  if (cacheableOperations && !cacheableOperations.includes('chromatic')) {
    nxJson.tasksRunnerOptions.default.options.cacheableOperations.push(
      'chromatic'
    );
  }

  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults['chromatic'] ??= {};
  const chromaticTarget = nxJson.targetDefaults['chromatic'];
  chromaticTarget.cache = true;
  chromaticTarget.dependsOn = ["build-storybook"];
  chromaticTarget.executor = "nx-chromatic:chromatic";
  chromaticTarget.options ??= {};
  chromaticTarget.options.configFile = '{projectRoot}/.storybook/chromatic.config.json';

  updateNxJson(tree, nxJson);
}

export function initGenerator(tree: Tree, schema: InitGeneratorSchema) {
  return initGeneratorInternal(tree, { addPlugin: false, ...schema });
}

export async function initGeneratorInternal(tree: Tree, schema: InitGeneratorSchema) {
  assertNotUsingTsSolutionSetup(tree, 'chromatic', 'init');

  const nxJson = readNxJson(tree);
  const addPluginDefault =
    process.env.NX_ADD_PLUGINS !== 'false' &&
    nxJson.useInferencePlugins !== false;
  schema.addPlugin ??= addPluginDefault;

  addCacheableOperation(tree);
  addChromaticAddon(tree);

  const tasks: GeneratorCallback[] = [];

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;