import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";
export default createMuiTheme({
  overrides: {
    MuiCardContent: {
      root: {
        padding: 0,
        "&:last-child": {
          paddingBottom: 0,
        },
      },
    },
    MuiCardActions: {
      root: {
        padding: 0,
      },
    },
    MuiStepIcon: {
      root: {
        "&$completed": {
          color: "pink",
        },
        "&$active": {
          color: "red",
        },
      },
      active: {},
      completed: {},
    },
  },
});
