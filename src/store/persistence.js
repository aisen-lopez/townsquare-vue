module.exports = store => {
  // initialize data
  if (localStorage.background !== undefined) {
    store.commit("setBackground", localStorage.background);
  }
  if (localStorage.isPublic !== undefined) {
    store.commit("toggleGrimoire", JSON.parse(localStorage.isPublic));
  }
  if (localStorage.edition !== undefined) {
    // this will initialize state.roles!
    store.commit("setEdition", localStorage.edition);
  }
  if (localStorage.bluffs !== undefined) {
    JSON.parse(localStorage.bluffs).forEach((role, index) => {
      store.commit("setBluff", {
        index,
        role: store.state.roles.get(role) || {}
      });
    });
  }
  if (localStorage.players) {
    store.commit(
      "players/set",
      JSON.parse(localStorage.players).map(player => ({
        ...player,
        role: store.state.roles.get(player.role) || {}
      }))
    );
  }

  // listen to mutations
  store.subscribe(({ type, payload }, state) => {
    switch (type) {
      case "toggleGrimoire":
      case "showGrimoire":
        localStorage.setItem(
          "isPublic",
          JSON.stringify(state.grimoire.isPublic)
        );
        break;
      case "setBackground":
        if (payload) {
          localStorage.setItem("background", payload);
        } else {
          localStorage.removeItem("background");
        }
        break;
      case "setEdition":
        localStorage.setItem("edition", payload);
        break;
      case "setBluff":
        localStorage.setItem(
          "bluffs",
          JSON.stringify(state.grimoire.bluffs.map(({ id }) => id))
        );
        break;
      case "players/add":
      case "players/update":
      case "players/remove":
      case "players/clear":
      case "players/set":
        if (state.players.players.length) {
          localStorage.setItem(
            "players",
            JSON.stringify(
              state.players.players.map(player => ({
                ...player,
                // simplify the stored data
                role: player.role.id || {}
              }))
            )
          );
        } else {
          localStorage.removeItem("players");
        }
        break;
    }
  });
};
