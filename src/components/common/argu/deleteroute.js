import { storeSetting } from "./config";

import mainRoutes from "./../../../router";

export const resetRouter = vm => {  
   
  vm.$router.matcher = mainRoutes.matcher;
//   router.matcher = new Router({mode: 'history'}).matcher;
};

export const deleteLocalRouter = name => {
    const { dynamicName } = storeSetting;
    const localRoutes =
      sessionStorage.getItem(dynamicName) &&
      JSON.parse(sessionStorage.getItem(dynamicName));
    if (localRoutes && localRoutes.length > 0) {
      for (let i = 0; i < localRoutes.length; i++) {
        if (localRoutes[i].path === name.path) {
          localRoutes.splice(i, 1);
          sessionStorage.setItem(dynamicName, JSON.stringify(localRoutes));
          break;
        }
      }
    }
};