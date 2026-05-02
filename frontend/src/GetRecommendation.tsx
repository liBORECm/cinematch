import { Button } from "@mui/material";
import type { Movie } from "./models/movie";
import type { UserProfile } from "./models/userProfile";
import { Service } from "./Service";

export default function GetRecommendations(props: {
  profile: UserProfile
  setRecommendedContent: (recommended: Array<Movie>) => void
  setRecommendedCollab: (recommended: Array<Movie>) => void
}) {
  const recommend = async () => {
    const collab = await Service.recommendCollab(props.profile)
    const content = await Service.recommendContentBased(props.profile)

    props.setRecommendedCollab(collab)
    props.setRecommendedContent(content)
  }

  return <>
    <Button onClick={recommend}>Suggest movies</Button>
  </>
}