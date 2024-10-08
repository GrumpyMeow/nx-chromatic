# NX-plugin for Chromatic

This nx-plugin for Chromatic is work-in-progress.


This nx-plugin is not an official Chromatic, NX or Storybook project. Please don't bother them with issues caused by this plugin.

Todo's:

- [ ] Get the chromatic-token from the chromatic-config file
- [ ] Implement inferred tasks
- [ ] Find solution for `buildScriptName` in NX-workspace




Temporary workaround for `buildScriptName`: 
  Add in package.json:
  ```
  "scripts": {
    "build-storybook": "nx run $NX_TASK_TARGET_PROJECT:build-storybook"
  },
  ```


# Install
Run: `pnpm nx add nx-chromatic`

Add in each project.json:
```
    "chromatic": { },

```