# nx-chromatic: NX-plugin for Chromatic

This nx-plugin for Chromatic is work-in-progress.

This nx-plugin is not an official Chromatic, NX or Storybook project. Please don't bother them with issues caused by this plugin.

This nx-plugin should help you to:
* add [Chromatic CLI](https://www.chromatic.com/docs/cli/) to do Visual Testing to your Storybook enabled projects
* add the [Chromatic Storybook Add-on](https://www.chromatic.com/docs/visual-tests-addon/) to your Storybook enabled projects

## Install
Install the package with: `pnpm nx add nx-chromatic`

* During the install your `nx.json` file will be modified to provide the target `chromatic` with general options.
* During the install your `main.ts` files will be modified to add the `@chromatic-com/storybook` Storybook add-on.
* During the install an empty `chromatic.config.json` file will be created. From within Storybook this file can be further configured by linking to Chromatic. 

## Configure projects
For each project you want to have Chromatic as target, add in project.json:
```
    "chromatic": { },
```


