AppSettingsPage({
  build() {
    return Section({}, [
      Toggle({
        label: "Debug UI",
        settingsKey: "debugUI",
      }),
    ]);
  },
});
