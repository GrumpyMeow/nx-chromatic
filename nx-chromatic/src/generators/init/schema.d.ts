export interface InitGeneratorSchema {
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  keepExistingVersions?: boolean;
  updatePackageScripts?: boolean;
  addPlugin?: boolean;
  addChromaticAddon?: boolean;
  addChromaticTarget?: boolean;
}
