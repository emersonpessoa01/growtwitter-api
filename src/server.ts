import App from "./app";
import { envs } from "./envs";
import {
  AuthRoutes,
  FollowersRoutes,
  LikesRoutes,
  TweetsRoutes,
  UsersRoutes,
} from "./routes";

const serverInstance = new App(
  [
    AuthRoutes.bind(),
    UsersRoutes.bind(),
    TweetsRoutes.bind(),
    LikesRoutes.bind(),
    FollowersRoutes.bind(),
  ],
  envs.PORT,
);

if (!process.env.VERCEL) {
  serverInstance.listen();
}

export default serverInstance.app;
