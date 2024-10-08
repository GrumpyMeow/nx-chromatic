import {
  formatFiles,
  GeneratorCallback,
  readNxJson,
  runTasksInSerial,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import { assertNotUsingTsSolutionSetup } from '@nx/js/src/utils/typescript/ts-solution-setup';
import { InitGeneratorSchema } from './schema';

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

  const tasks: GeneratorCallback[] = [];

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

export default initGenerator;