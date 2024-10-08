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
    forEachExecutorOptions(
      tree,
      '@storybook/angular:build-storybook',
      (_, projectName, targetName) => {
        const project = readProjectConfiguration(tree, projectName);

        const filename = joinPathFragments(
          project.root,
          '.storybook',
          'main.ts');
        const previewTs = tree.read(filename);

        let content = previewTs.toString();
        if (!content.includes('@chromatic-com/storybook')) {
          content = content.replace('\'@storybook/addon-essentials\'', '\'@storybook/addon-essentials\', \'@chromatic-com/storybook\'')

          // Todo: probably beter to trigger for all projects: `pnpx storybook add @chromatic-com/storybook --config-dir apps/nxtest/.storybook`

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
  nxJson.targetDefaults['chromatic'].cache = true;
  nxJson.targetDefaults['chromatic'].dependsOn = ["build-storybook"];
  nxJson.targetDefaults['chromatic'].executor = "nx-chromatic:chromatic";

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