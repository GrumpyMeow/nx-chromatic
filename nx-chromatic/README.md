# nx-chromatic: NX-plugin for Chromatic

Warning! This nx-plugin for Chromatic is work-in-progress.

This nx-plugin is not an official [Chromatic](https://www.chromatic.com/), [NX](https://nx.dev/) or [Storybook](https://storybook.js.org/) project. Please don't bother them with issues caused by this plugin.

This nx-plugin should help you to:
* add [Chromatic CLI](https://www.chromatic.com/docs/cli/) to do Visual Testing to your Storybook enabled projects
* add the [Chromatic Storybook Add-on](https://www.chromatic.com/docs/visual-tests-addon/) to your Storybook enabled projects

This nx-plugin heavily relies on these NPM-packages:
* [Chromatic](https://www.npmjs.com/package/chromatic)
* [@chromatic-com/storybook](https://www.npmjs.com/package/@chromatic-com/storybook)


## Install
Install the package with: 
* pnpm: `pnpm nx add nx-chromatic`
* npm: `npx nx add nx-chromatic`

During the install:
* your `nx.json` file will be modified to provide the target `chromatic` with general options.
* your `main.ts` files will be modified to add the `@chromatic-com/storybook` Storybook add-on.
* an empty `chromatic.config.json` file will be created for each Storybook instance.

## Configure Chromatic-target
For each project you want to have Chromatic as target, add in project.json:
```
    "chromatic": { },
```

## Configure Chromatic Storybook addon
1. Start your Storybook instance.
2. From within Storybook this file can be further configured by linking to Chromatic. 

## Version matrix

| nx    | nx-chromatic | storybook | chromatic  | @chromatic-com/storybook | 
|-------|--------------|-----------|------------|-----------------------|
| v20   | v20.0.x      | v7/v8     | >= v11.0.0 | >= v1.9.0             |
| v18   | v18.0.x      | v7/v8     | >= v11.0.0 | >= v1.9.0             |


