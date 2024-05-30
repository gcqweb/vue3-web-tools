import { useRoute, useRouter } from "vue-router";

const getCurrentRouteChildren = () => {
  const router = useRouter();
  const route = useRoute();
  const routes = router.getRoutes();

  function findChildren(path, routes) {
    for (const r of routes) {
      if (r.path === path) {
        return r.children;
      }
      if (r.children) {
        const found = findChildren(path, r.children);
        if (found) return found;
      }
    }
    return null;
  }

  return findChildren(route.path, routes);
};

export default getCurrentRouteChildren;
