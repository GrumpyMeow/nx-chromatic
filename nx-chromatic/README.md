# nx=chromatic: NX-plugin for Chromatic

This nx-plugin for Chromatic is work-in-progress.

This nx-plugin is not an official Chromatic, NX or Storybook project. Please don't bother them with issues caused by this plugin.

## Install
Install the package with: `pnpm nx add nx-chromatic`

* During the install your `nx.json` file will be modified to provide the target `chromatic`.
* During the install your `main.ts` files will be modified to add the `@chromatic-com/storybook` Storybook add-on.
* During the install an empty `chromatic.config.json` file will be created. From within Storybook this file can be further configured by linking to Chromatic. 

## Configure projects
For each project you want to have Chromatic as target, add in project.json:
```
    "chromatic": { },
```


