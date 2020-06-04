import Vue from "vue";
import Vuex from "vuex";
import persistence from "./persistence";
import session from "./session";
import players from "./modules/players";
import editionJSON from "../editions.json";
import rolesJSON from "../roles.json";

Vue.use(Vuex);

const getRolesByEdition = (edition = "tb") => {
  const selectedEdition =
    editionJSON.find(({ id }) => id === edition) || editionJSON[0];
  return new Map(
    rolesJSON
      .filter(
        r => r.edition === edition || selectedEdition.roles.includes(r.id)
      )
      .sort((a, b) => b.team.localeCompare(a.team))
      .map(role => [role.id, role])
  );
};

export default new Vuex.Store({
  modules: {
    players
  },
  state: {
    grimoire: {
      isNightOrder: true,
      isPublic: true,
      isMenuOpen: false,
      isScreenshot: false,
      isScreenshotSuccess: false,
      zoom: 1,
      background: "",
      bluffs: []
    },
    session: {
      sessionId: "",
      isSpectator: false,
      playerCount: 0,
      playerId: ""
    },
    modals: {
      reference: false,
      edition: false,
      roles: false,
      role: false,
      reminder: false
    },
    edition: "tb",
    roles: getRolesByEdition()
  },
  mutations: {
    toggleMenu({ grimoire }) {
      grimoire.isMenuOpen = !grimoire.isMenuOpen;
    },
    toggleGrimoire({ grimoire }, isPublic) {
      if (isPublic === true || isPublic === false) {
        grimoire.isPublic = isPublic;
      } else {
        grimoire.isPublic = !grimoire.isPublic;
      }
      document.title = `Blood on the Clocktower ${
        grimoire.isPublic ? "Town Square" : "Grimoire"
      }`;
    },
    toggleNightOrder({ grimoire }) {
      grimoire.isNightOrder = !grimoire.isNightOrder;
    },
    updateZoom({ grimoire }, by = 0) {
      grimoire.zoom += by;
    },
    setBackground({ grimoire }, background) {
      grimoire.background = background;
    },
    setSessionId({ session }, sessionId) {
      session.sessionId = sessionId;
    },
    setPlayerId({ session }, playerId) {
      session.playerId = playerId;
    },
    setSpectator({ session }, spectator) {
      session.isSpectator = spectator;
    },
    setPlayerCount({ session }, playerCount) {
      session.playerCount = playerCount;
    },
    setBluff({ grimoire }, { index, role } = {}) {
      if (index !== undefined) {
        grimoire.bluffs.splice(index, 1, role);
      } else {
        grimoire.bluffs = [];
      }
    },
    toggleModal({ modals }, name) {
      if (name) {
        modals[name] = !modals[name];
      }
      for (let modal in modals) {
        if (modal === name) continue;
        modals[modal] = false;
      }
    },
    updateScreenshot({ grimoire }, status) {
      if (status !== true && status !== false) {
        grimoire.isScreenshotSuccess = false;
        grimoire.isScreenshot = true;
      } else {
        grimoire.isScreenshotSuccess = status;
        grimoire.isScreenshot = false;
      }
    },
    setRoles(state, roles) {
      state.roles = new Map(
        rolesJSON
          .filter(r => roles.includes(r.id))
          .sort((a, b) => b.team.localeCompare(a.team))
          .map(role => [role.id, role])
      );
    },
    setEdition(state, edition) {
      state.edition = edition;
      state.modals.edition = false;
      if (edition !== "custom") {
        state.roles = getRolesByEdition(edition);
      }
    }
  },
  plugins: [persistence, session]
});
